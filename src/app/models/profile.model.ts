export interface Profile {

  // =========================
  // ACCOUNT
  // =========================

  memberId: string;
  phone: string;

  // =========================
  // BASIC DETAILS
  // =========================

  profileFor: string;
  gender: string;
  fullName: string;

  maritalStatus: string;

  hasKids?: string;
  numberOfKids?: string;
  kidsLivingStatus?: string;

  dobDay: string;
  dobMonth: string;
  dobYear: string;

  age: number | null;

  height: number;


  // =========================
  // LOCATION
  // =========================

  district: string;
  state: string;
  pincode: string;

  houseName: string;
  place: string;

  latitude?: number;
  longitude?: number;

  locationSource?: 'current' | 'map' | 'manual';


  // =========================
  // RELIGION & COMMUNITY
  // =========================

  religion: string;

  // Muslim
  sect?: string;
  muslimGroup?: string;
  salafiGroup?: string;

  // Hindu
  caste?: string;
  subCaste?: string;
  nakshatra?: string;
  rashi?: string;
  dosham?: string;

  // Christian
  denomination?: string;
  christianSubGroup?: string;
  parishName?: string;


  // =========================
  // EDUCATION & CAREER
  // =========================

  highestEducation: string;
  specialization?: string;

  jobTitle: string;
  jobSector: string;


  // =========================
  // PARTNER PREFERENCE
  // =========================

  preferredAgeMin: number;
  preferredAgeMax: number;

  preferredHeightMin: number;
  preferredHeightMax: number;

  preferredMaritalStatus: string[];

  acceptanceOfKids: string;

  preferredReligion: string;
  preferredSects?: string[];
  preferredSunniGroups?: string[];
  preferredSalafiGroups?: string[];

  preferredCaste?: string[];
  preferredSubCaste?: string[];

  preferredEducation: string[];

  preferredCareerSector: string[];

  preferredLocations: string[];


  // =========================
  // PROFILE COMPLETION
  // =========================

  completionPercentage?: number;


  // =========================
  // PHYSICAL DETAILS
  // =========================

  weight?: number;

  bodyType?: string;

  complexion?: string;

  physicalStatus?: string;


  // =========================
  // CONTACT INFORMATION
  // =========================

  secondaryMobile?: string;

  whatsappNumber?: string;

  email?: string;


  // =========================
  // WORK / EDUCATION DETAILS
  // =========================

  collegeUniversity?: string;

  annualIncome?: string;

  workLocation?: string;

  companyName?: string;


  // =========================
  // FAMILY DETAILS
  // =========================

  fatherName?: string;
  fatherOccupation?: string;
  fatherStatus?: string;

  motherName?: string;
  motherOccupation?: string;
  motherStatus?: string;

  brothers?: number | null;
  sisters?: number | null;

  marriedBrothers?: number | null;
  marriedSisters?: number | null;

  familyStatus?: string;
  homeType?: string;

  // =========================
  // ADDITIONAL PREFERENCES
  // =========================

  preferredFamilyStatus?: string[];

  preferredPhysicalStatus?: string[];

  preferredIncome?: string[];

  preferredLocationRadius?: string[];

  preferredComplexion?: string[];


  // Hindu specific
  horoscopeRequired?: string;

  preferredStar?: string[];


  // =========================
  // EXPECTATIONS
  // =========================

  expectations?: string;


  // =========================
  // PHOTOS
  // =========================

  photoCount?: number;

  photos?: string[];

  primaryPhoto?: string;

  // =========================
  // STATUS
  // =========================

  registrationCompleted: boolean;

  homeVerified?: boolean;

  profileCreatedAt?: string;

}