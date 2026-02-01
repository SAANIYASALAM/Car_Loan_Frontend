export enum CarType {
  Hatchback = 0,
  Sedan = 1,
  CompactSedan = 2,
  CompactSUV = 3,
  MidSizeSUV = 4,
  FullSizeSUV = 5,
  MUVMPV = 6,
  ElectricVehicle = 7,
  Hybrid = 8,
  LuxurySedan = 9,
  LuxurySUV = 10,
  Coupe = 11,
  Convertible = 12,
  Commercial = 13,
  UsedCar = 14
}

export enum LoanStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Active = 3,
  Closed = 4
}

export enum PaymentStatus {
  Pending = 0,
  Paid = 1,
  Overdue = 2
}

export const CarTypeLabels: Record<CarType, string> = {
  [CarType.Hatchback]: 'Hatchback',
  [CarType.Sedan]: 'Sedan',
  [CarType.CompactSedan]: 'Compact Sedan',
  [CarType.CompactSUV]: 'Compact SUV',
  [CarType.MidSizeSUV]: 'Mid-Size SUV',
  [CarType.FullSizeSUV]: 'Full-Size SUV',
  [CarType.MUVMPV]: 'MUV/MPV',
  [CarType.ElectricVehicle]: 'Electric Vehicle',
  [CarType.Hybrid]: 'Hybrid',
  [CarType.LuxurySedan]: 'Luxury Sedan',
  [CarType.LuxurySUV]: 'Luxury SUV',
  [CarType.Coupe]: 'Coupe',
  [CarType.Convertible]: 'Convertible',
  [CarType.Commercial]: 'Commercial',
  [CarType.UsedCar]: 'Used Car'
};

export const LoanStatusLabels: Record<LoanStatus, string> = {
  [LoanStatus.Pending]: 'Pending',
  [LoanStatus.Approved]: 'Approved',
  [LoanStatus.Rejected]: 'Rejected',
  [LoanStatus.Active]: 'Active',
  [LoanStatus.Closed]: 'Closed'
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'Pending',
  [PaymentStatus.Paid]: 'Paid',
  [PaymentStatus.Overdue]: 'Overdue'
};
