export type SecretsType = {
  IpmiIp: String;
  IpmiUser: String;
  IpmiPassword: String;
  glancesIp: String;
};

export interface Glances {
  load: Load;
  help: null;
  ip: IP;
  connections: Connections;
  memswap: Memswap;
  processlist: Processlist[];
  cloud: Cloud;
  uptime: string;
  network: Network[];
  percpu: Percpu[];
  irq: IRQ[];
  system: System;
  diskio: Diskio[];
  gpu: any[];
  smart: Cloud;
  folders: any[];
  core: Core;
  fs: F[];
  raid: Cloud;
  mem: Mem;
  alert: Array<Alert[]>;
  psutilversion: number[];
  sensors: Sensor[];
  now: string;
  quicklook: Quicklook;
  wifi: any[];
  cpu: { [key: string]: number };
  processcount: Processcount;
  amps: Amp[];
  docker: Docker;
  ports: Port[];
}

export type Alert = any[] | number | string;

export interface Amp {
  count: number;
  timer: number;
  countmax: number | null;
  name: string;
  key: string;
  regex: boolean;
  countmin: number | null;
  refresh: number;
  result: null;
}

export interface Cloud {}

export interface Connections {
  established: number;
  initiated: number;
  terminated: number;
  synRecv: number;
  synSent: number;
  listen: number;
}

export interface Core {
  phys: number;
  log: number;
}

export interface Diskio {
  readCount: number;
  writeBytes: number;
  writeCount: number;
  timeSinceUpdate: number;
  readBytes: number;
  key: DiskioKey;
  diskName: string;
}

export enum DiskioKey {
  DiskName = "disk_name",
}

export interface Docker {
  containers: any[];
}

export interface F {
  mntPoint: string;
  fsType: string;
  free: number;
  key: string;
  size: number;
  percent: number;
  used: number;
  deviceName: string;
}

export interface IP {
  maskCIDR: number;
  mask: string;
  gateway: string;
  address: string;
}

export interface IRQ {
  irqRate: number;
  irqLine: string;
  key: string;
  timeSinceUpdate: number;
}

export interface Load {
  cpucore: number;
  min1: number;
  min5: number;
  min15: number;
}

export interface Mem {
  available: number;
  used: number;
  cached: number;
  percent: number;
  free: number;
  inactive: number;
  active: number;
  shared: number;
  total: number;
  buffers: number;
}

export interface Memswap {
  used: number;
  percent: number;
  free: number;
  sout: number;
  total: number;
  sin: number;
}

export interface Network {
  timeSinceUpdate: number;
  cx: number;
  isUp: boolean;
  key: string;
  speed: number;
  tx: number;
  cumulativeRx: number;
  rx: number;
  cumulativeCx: number;
  alias: null;
  cumulativeTx: number;
  interfaceName: string;
}

export interface Percpu {
  cpuNumber: number;
  guestNice: number;
  softirq: number;
  iowait: number;
  system: number;
  guest: number;
  idle: number;
  user: number;
  key: PercpuKey;
  irq: number;
  total: number;
  steal: number;
  nice: number;
}

export enum PercpuKey {
  CPUNumber = "cpu_number",
}

export interface Port {
  status: number;
  indice: string;
  description: string;
  refresh: number;
  host: string;
  rttWarning: null;
  timeout: number;
  port: number;
}

export interface Processcount {
  running: number;
  total: number;
  pidMax: number;
  thread: number;
  sleeping: number;
}

export interface Processlist {
  status: Status;
  username: Username;
  udp?: number;
  cpuTimes: number[];
  numCtxSwitches?: number[];
  pid: number;
  tcp?: number;
  ioCounters: number[];
  cmdline: string[];
  memoryInfo: number[];
  ionice?: number[];
  numFDS?: number;
  memorySwap?: number;
  numThreads: number;
  name: string;
  cpuPercent: number;
  cpuAffinity?: number[];
  gids: number[];
  extendedStats?: boolean;
  memoryPercent: number;
  ppid: number;
  timeSinceUpdate: number;
  nice: number;
}

export enum Status {
  I = "I",
  R = "R",
  S = "S",
}

export enum Username {
  Messagebus = "messagebus",
  Postfix = "postfix",
  RPC = "_rpc",
  Root = "root",
  SystemdTimesync = "systemd-timesync",
  WWWData = "www-data",
}

export interface Quicklook {
  percpu: Percpu[];
  mem: number;
  cpuHz: number;
  cpuHzCurrent: number;
  cpuName: string;
  swap: number;
  cpu: number;
}

export interface Sensor {
  value: number;
  warning: number;
  critical: number;
  key: SensorKey;
  type: SensorType;
  unit: Unit;
  label: string;
}

export enum SensorKey {
  Label = "label",
}

export enum SensorType {
  TemperatureCore = "temperature_core",
}

export enum Unit {
  C = "C",
}

export interface System {
  osName: string;
  osVersion: string;
  linuxDistro: string;
  hostname: string;
  platform: string;
  hrName: string;
}
