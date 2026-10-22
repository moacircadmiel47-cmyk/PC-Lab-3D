import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialInstalledState,
  validateInstallation,
  validateRemoval,
  simulatePostBoot,
} from './compatibility';

test('1. CPU compatível com a placa-mãe correta é aceita (Ryzen 5 5600X em B550 AM4)', () => {
  const state = createInitialInstalledState();
  const res = validateInstallation(state, 'cpu-amd-ryzen-5-5600x', 'slot_cpu', 0);
  assert.equal(res.allowed, true);
  assert.equal(res.status, 'COMPATIBLE');
  assert.equal(res.code, 'CPU_OK');
});

test('2. CPU incompatível com outro socket é rejeitada com explicação (Intel LGA 1700 em placa AM4)', () => {
  const state = createInitialInstalledState();
  const res = validateInstallation(state, 'cpu-intel-i5-12400f', 'slot_cpu', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'CPU_SOCKET_MISMATCH');
  assert.match(res.message, /LGA1700/);
  assert.match(res.message, /AM4/);
});

test('3. CPU com orientação física incorreta (girada 90°) é rejeitada para proteger os pinos', () => {
  const state = createInitialInstalledState();
  const res = validateInstallation(state, 'cpu-amd-ryzen-5-5600x', 'slot_cpu', 1);
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'CPU_WRONG_ORIENTATION');
});

test('4. RAM DDR3 rejeitada por um slot DDR4', () => {
  const state = createInitialInstalledState(); // ASUS B550M-Plus (DDR4)
  const res = validateInstallation(state, 'ram-ddr3-8gb-1600', 'slot_ram_1', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'RAM_DDR_GENERATION_MISMATCH');
});

test('5. RAM DDR4 rejeitada por um slot DDR5', () => {
  const state = createInitialInstalledState();
  state.motherboardId = 'mb-asus-rog-z790-hero-ddr5';
  const res = validateInstallation(state, 'ram-ddr4-16gb-3200', 'slot_ram_1', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'RAM_DDR_GENERATION_MISMATCH');
});

test('6. RAM SO-DIMM (Notebook) rejeitada em slot DIMM de desktop', () => {
  const state = createInitialInstalledState();
  const res = validateInstallation(state, 'ram-ddr4-sodimm-8gb-notebook', 'slot_ram_1', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'RAM_FORM_FACTOR_MISMATCH');
});

test('7. SSD M.2 SATA (B+M Key) rejeitado por slot M.2 exclusivo NVMe PCIe', () => {
  const state = createInitialInstalledState();
  state.motherboardId = 'mb-msi-b660m-mortar-ddr4'; // slot_m2_1 suporta apenas NVMe PCIe
  const res = validateInstallation(state, 'storage-ssd-wd-green-m2-sata-500gb', 'slot_m2_1', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'M2_PROTOCOL_MISMATCH_SATA_IN_NVME_ONLY');
});

test('8. Placa-mãe ATX incompatível com gabinete compacto Micro-ATX / Mini-ITX', () => {
  const state = createInitialInstalledState();
  state.caseId = 'case-cooler-master-q300l-matx'; // Apenas Micro-ATX e Mini-ITX
  const res = validateInstallation(state, 'mb-asus-rog-z790-hero-ddr5', 'slot_motherboard', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'MB_CASE_FORM_FACTOR_MISMATCH');
});

test('9. Fonte sem conectores PCIe necessários é rejeitada ao alimentar GPU dedicada de 132W', () => {
  const state = createInitialInstalledState();
  state.psuId = 'psu-generic-300w'; // 0 conectores PCIe 8-pin
  state.gpuId = 'gpu-rx-6600-8gb'; // Requer 1x8-pin
  const res = validateInstallation(state, 'cable-pcie-power', 'slot_cable_pcie_power', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INCOMPATIBLE');
  assert.equal(res.code, 'PSU_MISSING_PCIE_8PIN');
});

test('10. Slot ocupado não aceita outra peça', () => {
  const state = createInitialInstalledState();
  state.ramSlots.slot_ram_1 = 'ram-ddr4-16gb-3200';
  const res = validateInstallation(state, 'ram-ddr4-16gb-3200', 'slot_ram_1', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.code, 'RAM_SLOT_OCCUPIED');
});

test('11. Tentativa de remover CPU com cooler instalado é bloqueada por dependência', () => {
  const state = createInitialInstalledState();
  state.cpuId = 'cpu-amd-ryzen-5-5600x';
  state.thermalPasteApplied = true;
  state.coolerId = 'cooler-deepcool-ak400-tower';
  const res = validateRemoval(state, 'slot_cpu');
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'DEPENDENCY_MISSING');
  assert.equal(res.code, 'CANNOT_REMOVE_CPU_WITH_COOLER');
});

test('12. Configuração sem dados suficientes (Placa OEM sem tabela de CPU/TDP) retorna INSUFFICIENT_DATA em vez de inventar resposta', () => {
  const state = createInitialInstalledState();
  state.motherboardId = 'mb-didactic-oem-unverified-lga775';
  const res = validateInstallation(state, 'cpu-intel-q6600-lga775', 'slot_cpu', 0);
  assert.equal(res.allowed, false);
  assert.equal(res.status, 'INSUFFICIENT_DATA');
  assert.equal(res.code, 'CPU_MB_INSUFFICIENT_DATA');
});

test('13. Simulação de POST falha quando falta memória RAM e passa quando o PC está completo', () => {
  const state = createInitialInstalledState();
  state.cpuId = 'cpu-amd-ryzen-5-5600x';
  state.thermalPasteApplied = true;
  state.coolerId = 'cooler-deepcool-ak400-tower';
  state.gpuId = 'gpu-gtx-1650-4gb';
  state.m2Slots.slot_m2_1 = 'storage-ssd-samsung-980-pro-1tb-nvme4';

  // Sem RAM -> falha no estágio 4 (0x53)
  const failPost = simulatePostBoot(state);
  assert.equal(failPost.postSuccess, false);
  assert.equal(failPost.postHexCode, '0x53');

  // Com RAM DDR4 -> POST e Boot 100% operacionais
  state.ramSlots.slot_ram_2 = 'ram-ddr4-16gb-3200';
  const passPost = simulatePostBoot(state);
  assert.equal(passPost.postSuccess, true);
  assert.equal(passPost.bootToOsSuccess, true);
});
