export type User = {
  fullName: string;
  email: string;
  role: string;
  address: string;
  gender: string;
  password: string;
};
export type Loggeduser = {
  fullName: string;
  email: string;
  role: string;
  address: string;
  gender: string;
  password: string;
  _id: number;
};
export type loginUser = {
  email: string;
  password: string;
};
export type appointment = {
  doctorId: string;
  description: string;
  date: string;
  timeFrom: Date | null;
  timeTo: Date | null;
};

export type finalAppointment = {
  patientId: string,
  status: string,
  doctorId: doctor;
  description: string;
  date: string;
  timeFrom: Date;
  timeTo: Date;
}
export type doctorsAppointment = {
  patientId: Loggeduser,
  status: string,
  doctorId: doctor;
  description: string;
  date: string;
  timeFrom: Date;
  timeTo: Date;
  _id: string
}
export type doctor = {
  fullName: string;
  email: string;
  role: string;
  address: string;
  gender: string;
  password: string;
  _id: string;
};