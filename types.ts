
export enum DonationType {
  BLOOD = 'BLOOD',
  STEM_CELL = 'STEM_CELL',
  PLASMA = 'PLASMA'
}

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export interface Donor {
  id: string;
  name: string;
  bloodType: BloodType;
  donationType: DonationType;
  lastDonationDate: string;
  location: string;
  contact: string;
  availability: string[];
  preferredTime: string;
}

export interface Bank {
  id: string;
  name: string;
  location: string;
  stock: Record<BloodType, number>;
  contact: string;
}

export interface Appointment {
  id: string;
  donorId: string;
  bankId: string;
  date: string;
  time: string;
  type: DonationType;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
}

export interface UrgentRequest {
  id: string;
  patientName: string;
  bloodType: BloodType;
  location: string;
  hospital: string;
  requiredBy: string;
  unitsNeeded: number;
  status: 'SEARCHING' | 'MATCHED' | 'DISPATCHED' | 'DELIVERED';
}
