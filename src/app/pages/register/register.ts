import {
  Component,
  ChangeDetectorRef,
  AfterViewChecked
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Profile } from '../../models/profile.model'
import { ApiService } from '../../services/api'
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { ProfileService } from '../../services/profile';
import * as L from 'leaflet';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements AfterViewChecked {

  private buildProfile(): Profile {

    const profile: Profile = {





      // =========================
      // ACCOUNT
      // =========================

      memberId: this.memberId || '',
      phone: this.phone || '',


      // =========================
      // BASIC DETAILS
      // =========================

      profileFor: this.profileFor || '',
      gender: this.gender || '',
      fullName: this.fullName || '',

      maritalStatus: this.maritalStatus || '',

      hasKids: this.hasKids || undefined,
      numberOfKids: this.numberOfKids || undefined,
      kidsLivingStatus: this.kidsLivingStatus || undefined,

      dobDay: this.dobDay || '',
      dobMonth: this.dobMonth || '',
      dobYear: this.dobYear || '',

      age: this.calculatedAge,

      // IMPORTANT:
      // Height is stored as total inches
      height: Number(this.heightInches) || 0,


      // =========================
      // LOCATION
      // =========================

      district: this.district || '',
      state: this.state || 'Kerala',
      pincode: this.pincode || '',

      houseName: this.houseName || '',
      place: this.place || '',

      latitude: this.latitude ?? undefined,
      longitude: this.longitude ?? undefined,

      locationSource:
        this.locationMethod || undefined,


      // =========================
      // RELIGION & COMMUNITY
      // =========================

      religion: this.religion || '',


      // Muslim
      sect: this.muslimSect || undefined,
      muslimGroup: this.sunniGroup || undefined,
      salafiGroup:
        this.salafiGroup || undefined,

      // Hindu
      caste: this.hinduCaste || undefined,
      subCaste: this.hinduSubCaste || undefined,

      nakshatra: this.nakshatra || undefined,
      rashi: this.rashi || undefined,
      dosham: this.dosham || undefined,

      // Christian
      denomination:
        this.christianDenomination || undefined,

      christianSubGroup:
        this.christianSubDenomination || undefined,

      parishName:
        this.otherChristianChurch || undefined,



      // =========================
      // EDUCATION & CAREER
      // =========================

      highestEducation:
        this.highestEducation || '',

      specialization:
        this.specialization || undefined,

      jobTitle:
        this.jobTitle || '',

      jobSector:
        this.jobSector || '',


      // =========================
      // PARTNER PREFERENCE
      // =========================

      preferredAgeMin:
        Number(this.preferredAgeMin) || 0,

      preferredAgeMax:
        Number(this.preferredAgeMax) || 0,

      preferredHeightMin:
        Number(this.preferredHeightMin) || 0,

      preferredHeightMax:
        Number(this.preferredHeightMax) || 0,

      preferredMaritalStatus:
        [...this.preferredMaritalStatuses],

      acceptanceOfKids:
        this.acceptanceOfKids || '',

      preferredReligion:
        this.preferredReligion || '',
      preferredSects:
        [...this.preferredSects],
      preferredSunniGroups:
        [...this.preferredSunniGroups],

      preferredSalafiGroups:
        [...this.preferredSalafiGroups],

      preferredCaste:
        [...this.preferredCastes],

      preferredSubCaste:
        [...this.preferredSubCastes],

      preferredEducation:
        [...this.preferredEducation],
      preferredEducationSpecific:
        [...this.preferredEducationSpecific],

      preferredCareerSector:
        [...this.preferredCareerSectors],

      preferredLocations:
        [...this.preferredLocations],


      // =========================
      // STATUS
      // =========================

      registrationCompleted: true,

      homeVerified: false,

      profileCreatedAt:
        new Date().toISOString()

    };

    return profile;
  }
  // =========================
  // REGISTRATION STEP
  // =========================
  private mapInitializationPending = false;
  private communityPreferenceDefaultsInitialized = false;
  step:
    | 'mobile'
    | 'otp'
    | 'password'
    | 'basic'
    | 'location'
    | 'religion'
    | 'education'
    | 'preferences'
    | 'success' = 'mobile';


  // =========================
  // MOBILE / OTP
  // =========================

  phone = '';

  otp = '';

  memberId = '';

  loading = false;

  confirmPassword = '';

  showPassword = false;

  showConfirmPassword = false;

  errorMessage = '';

  successMessage = '';

  password = '';

  // =========================
  // BASIC DETAILS
  // =========================

  profileFor = '';

  gender = '';

  fullName = '';

  maritalStatus = '';

  hasKids = '';

  numberOfKids = '';

  kidsLivingStatus = '';

  dobDay = '';

  dobMonth = '';

  dobYear = '';
  heightInches = '';
  calculatedAge: number | null = null;

  dobError = '';

  // =========================
  // LOCATION DETAILS
  // =========================

  locationMethod: 'current' | 'map' | 'manual' | '' = '';

  latitude: number | null = null;

  longitude: number | null = null;

  district = '';

  state = 'Kerala';

  pincode = '';

  place = '';

  houseName = '';

  locationLoading = false;

  locationError = '';
  showLocationDetails = false;

  showLocationModal = false;

  locationModalType: 'current' | 'map' | '' = '';

  locationProcessing = false;


  showDistrictSuggestions = false;

  districts = [
    'Alappuzha',
    'Ernakulam',
    'Idukki',
    'Kannur',
    'Kasaragod',
    'Kollam',
    'Kottayam',
    'Kozhikode',
    'Malappuram',
    'Palakkad',
    'Pathanamthitta',
    'Thiruvananthapuram',
    'Thrissur',
    'Wayanad'
  ];

  private map: L.Map | null = null;

  private mapMarker: L.Marker | null = null;

  selectedMapLatitude: number | null = null;

  selectedMapLongitude: number | null = null;
  // =========================
  // RELIGION & COMMUNITY
  // =========================

  religion = '';

  muslimSect = '';
  sunniGroup = '';
  salafiGroup = '';

  hinduCaste = '';
  hinduSubCaste = '';

  nakshatra = '';
  rashi = '';
  dosham = '';

  christianDenomination = '';
  christianSubDenomination = '';
  otherChristianChurch = '';


  muslimSects = [
    'Sunni',
    'Salafi',
    'Jamat Islami',
    'Hanafi',
    'Shafi',
    'Other'
  ];

  sunniGroups = [
    'AP-Sunni',
    'EK-Sunni',
    'Sunni',
  ];

  salafiGroups = [
    'KNM (Mainstream)',
    'KNM Markazu Dawa',
    'Wisdom',
    'Salafi Independent',
    'Other Salafi / Mujahid'
  ];

  hinduCastes = [
    'Thiyya / Ezhava',
    'Namboothiri',
    'Nair',
    'Viswakarma',
    'SC',
    'ST',
    'Other'
  ];

  nairSubCastes = [
    'Menon',
    'Pillai',
    'Panikkar',
    'Nambiar',
    'Kurupp',
    'Vilakithala Nair',
    'Veluthedath Nair'
  ];

  viswakarmaSubCastes = [
    'Asari (Carpenters)',
    'Kollan (Blacksmiths)',
    'Moosari (Bell metal and brass smiths)',
    'Thattan (Goldsmiths)',
    'Kallassary (Stonemasons)'
  ];

  scSubCastes = [
    'Pulayan / Pulayar',
    'Cheruman',
    'Kanakkan',
    'Kuravan',
    'Parayan',
    'Others'
  ];

  stSubCastes = [
    'Paniyan',
    'Irular',
    'Kurichiar',
    'Kanikkaran',
    'Other'
  ];

  nakshatras = [
    'Ashwini (Aswathi)',
    'Bharani',
    'Krittika (Karthika)',
    'Rohini',
    'Mrigashirsha (Makayiram)',
    'Ardra (Thiruvathira)',
    'Punarvasu (Punartham)',
    'Pushya (Pooyam)',
    'Ashlesha (Ayilyam)',
    'Magha (Makam)',
    'Purva Phalguni (Pooram)',
    'Uttara Phalguni (Uthram)',
    'Hasta (Atham)',
    'Chitra',
    'Swati (Chothi)',
    'Vishakha (Vishakam)',
    'Anuradha (Anizham)',
    'Jyeshtha (Thriketta)',
    'Mula (Moolam)',
    'Purva Ashadha (Pooradam)',
    'Uttara Ashadha (Uthradam)',
    'Shravana (Thiruvonam)',
    'Dhanishtha (Avittam)',
    'Shatabhisha (Chathayam)',
    'Purva Bhadrapada (Pooruruttathi)',
    'Uttara Bhadrapada (Uthrattathi)',
    'Revati'
  ];

  rashis = [
    'Medam (Aries)',
    'Idavam (Taurus)',
    'Midhunam (Gemini)',
    'Karkkidakam (Cancer)',
    'Chingam (Leo)',
    'Kanni (Virgo)',
    'Thulam (Libra)',
    'Vrischikam (Scorpio)',
    'Dhanu (Sagittarius)',
    'Makaram (Capricorn)',
    'Kumbham (Aquarius)',
    'Meenam (Pisces)'
  ];

  christianDenominations = [
    'Catholic',
    'Orthodox',
    'Protestant',
    'Pentecostal',
    'Other'
  ];

  // Preference-only options. Actual profile options above remain unchanged.
  preferredMuslimSectOptions = [
    'Sunni', 'Salafi', 'Jamat Islami', 'Hanafi', 'Shafi', 'Any'
  ];

  preferredSunniGroupOptions = [
    'AP-Sunni', 'EK-Sunni', 'Sunni', 'Any'
  ];

  preferredSalafiGroupOptions = [
    'KNM (Mainstream)', 'KNM Markazu Dawa', 'Wisdom',
    'Salafi Independent', 'Other Salafi / Mujahid', 'Any'
  ];

  preferredHinduCasteOptions = [
    'Thiyya / Ezhava', 'Namboothiri', 'Nair', 'Viswakarma', 'SC', 'ST', 'Any'
  ];

  preferredChristianDenominationOptions = [
    'Catholic', 'Orthodox', 'Protestant', 'Pentecostal', 'Any'
  ];

  christianOptions: Record<string, string[]> = {
    Catholic: [
      'Syro-Malabar Catholic',
      'Latin Catholic',
      'Syro-Malankara Catholic'
    ],

    Orthodox: [
      'Malankara Orthodox Syrian Church',
      'Jacobite Syrian Christian Church'
    ],

    Protestant: [
      'Church of South India (CSI)',
      'Mar Thoma Syrian Church',
      'St. Thomas Evangelical Church',
      'Lutheran'
    ],

    Pentecostal: [
      'Indian Pentecostal Church of God (IPC)',
      'Assemblies of God (AG)',
      'Church of God (Full Gospel) in India',
      'The Pentecostal Mission (TPM)',
      'Sharon Fellowship Church',
      'New India Church of God',
      'Other Pentecostal'
    ],

    Other: [
      'Chaldean Syrian Church',
      'Malabar Independent Syrian Church',
      'Seventh-day Adventist',
      'Salvation Army',
      'Brethren',
      "Jehovah's Witnesses",
      'Non-denominational',
      'Other'
    ]
  };

  // =========================
  // EDUCATION & CAREER
  // =========================

  highestEducation = '';

  specialization = '';

  jobTitle = '';

  jobSector = '';

  showJobSuggestions = false;


  // =========================
  // EDUCATION OPTIONS
  // =========================

  educationOptions = [
    'PhD / Doctorate',
    "Master's Degree",
    'Professional Degree',
    'General Degree (Bachelors)',
    'Diploma',
    'ITI / Technical Certificate',
    'Plus Two / Higher Secondary',
    'Religious / Islamic Education',
    'Others / Below 10th'
  ];


  specializations: Record<string, string[]> = {

    'PhD / Doctorate': [
      'Engineering',
      'Medicine',
      'Science',
      'Arts',
      'Commerce',
      'Management',
      'Law',
      'Education',
      'Social Science',
      'Computer Science / IT',
      'Other'
    ],

    "Master's Degree": [
      'MA',
      'MSc',
      'MCom',
      'MBA',
      'MCA',
      'MSW',
      'MEd',
      'LLM',
      'MTech',
      'Other'
    ],

    'Professional Degree': [
      'MBBS',
      'BDS',
      'BAMS',
      'BHMS',
      'BUMS',
      'BE / BTech',
      'LLB',
      'CA',
      'CMA',
      'CS',
      'PharmD',
      'Other Professional'
    ],

    'General Degree (Bachelors)': [
      'BA',
      'BSc',
      'BCom',
      'BBA',
      'BCA',
      'BBM',
      'BSW',
      'Other Bachelor’s'
    ],

    'Diploma': [
      'Engineering Diploma',
      'Medical / Paramedical',
      'Computer / IT',
      'Management',
      'Design',
      'Hospitality',
      'Other Diploma'
    ],

    'ITI / Technical Certificate': [
      'Electrician',
      'Fitter',
      'Mechanic',
      'Welder',
      'Plumber',
      'Computer / IT',
      'Automobile',
      'Electronics',
      'Other Technical'
    ],

    'Plus Two / Higher Secondary': [
      'Science',
      'Commerce',
      'Humanities',
      'Vocational',
      'Other'
    ],

    'Religious / Islamic Education': [
      'Madrasa',
      'Dars',
      'Alim',
      'Hifz',
      'Islamic Studies',
      'Other'
    ],

    'Others / Below 10th': [
      'SSLC',
      'Below SSLC',
      'Other'
    ]

  };


  // =========================
  // JOB SECTORS
  // =========================

  jobSectors = [
    'Business / Self Employed',
    'Private',
    'Government',
    'Freelance',
    'Student',
  ];


  // =========================
  // JOB TITLE SUGGESTIONS
  // =========================

  jobTitles = [
    'Accountant',
    'Accounts Executive',
    'Accounts Manager',
    'Administrative Assistant',
    'Architect',
    'Business Analyst',
    'Business Person',
    'Business Development Executive',
    'Civil Engineer',
    'Content Writer',
    'Customer Support Executive',
    'Data Analyst',
    'Designer',
    'Doctor',
    'Electrical Engineer',
    'Electrician',
    'Fashion Designer',
    'Finance Manager',
    'Graphic Designer',
    'HR Executive',
    'HR Manager',
    'IT Support',
    'Lawyer',
    'Lecturer',
    'Marketing Executive',
    'Marketing Manager',
    'Mechanical Engineer',
    'Nurse',
    'Pharmacist',
    'Photographer',
    'Professor',
    'Project Manager',
    'Sales Executive',
    'Sales Manager',
    'Software Developer',
    'Software Engineer',
    'Software Tester',
    'Teacher',
    'Technician',
    'Web Developer',
    'Other',
    'Student'
  ];

  // =========================
  // PARTNER PREFERENCES
  // =========================

  preferredAgeMin = '';

  preferredAgeMax = '';

  preferredHeightMin = '';

  preferredHeightMax = '';

  preferredMaritalStatuses: string[] = [];

  acceptanceOfKids = '';

  preferredReligion = '';

  preferredSects: string[] = [];

  preferredCastes: string[] = [];

  preferredSubCastes: string[] = [];
  preferredSunniGroups: string[] = [];

  preferredSalafiGroups: string[] = [];

  preferredLocations: string[] = [];

  preferredLocationInput = '';

  preferredEducation: string[] = [];
  preferredEducationSpecific: string[] = [];
  preferredCareerSectors: string[] = [];

  preferredEducationOptions = [
    'PhD / Doctorate',
    "Master's Degree",
    'Professional Degree',
    "Bachelor's Degree",
    'Diploma',
    'ITI / Technical Certificate',
    'Plus Two / Higher Secondary',
    'Religious / Islamic Education',
    'Others / Below 10th'
  ];


  educationSpecificOptions: {
    [key: string]: string[];
  } = {

      'Professional Degree': [
        'MBBS',
        'BDS',
        'BAMS',
        'BHMS',
        'BUMS',
        'BE / BTech',
        'LLB',
        'CA',
        'CMA',
        'CS',
        'PharmD',
        'Other Professional'
      ]

    };
  preferredCareerSectorOptions = [
    'Business / Self Employed',
    'Private',
    'Government',
    'Freelance',
    'Any'
  ];

  maritalStatusOptions = [
    {
      value: 'never_married',
      label: 'Never Married'
    },
    {
      value: 'divorced',
      label: 'Divorced'
    },
    {
      value: 'nikah_divorce',
      label: 'Nikah Divorce'
    },
    {
      value: 'widowed',
      label: 'Widowed'
    },
    {
      value: 'separated',
      label: 'Separated'
    },
    {
      value: 'awaiting_divorce',
      label: 'Awaiting Divorce'
    }
  ];



  // =========================
  // DATE DATA
  // =========================

  days = Array.from(
    { length: 31 },
    (_, i) => i + 1
  );

  months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' }
  ];

  years = Array.from(
    { length: 83 },
    (_, i) => new Date().getFullYear() - i
  );

  heightOptions = Array.from(
    { length: 40 },
    (_, i) => {

      const totalInches = 48 + i;

      const feet = Math.floor(totalInches / 12);
      const inches = totalInches % 12;

      const cm = Math.round(totalInches * 2.54);

      return {
        totalInches,
        feet,
        inches,
        cm
      };

    }
  );


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private http: HttpClient,
    private authService: AuthService,
    private profileService: ProfileService,

  ) { }


  ngOnInit(): void {

    const resume =
      this.route.snapshot.queryParamMap.get('resume');

    if (resume === 'true') {

      const token =
        localStorage.getItem('mwi_token');

      // No token → login
      if (!token) {
        sessionStorage.removeItem('mwi_registration_draft');
        this.router.navigate(['/login']);
        return;
      }

      // Token exists → verify with backend
      this.apiService.validateToken().subscribe({
        next: (response: any) => {

          if (response?.success === true) {

            this.loadRegistrationDraft();

            this.step = 'basic';

            this.cdr.detectChanges();

          } else {

            localStorage.removeItem('mwi_token');
            sessionStorage.removeItem('mwi_registration_draft');

            this.router.navigate(['/login']);
          }
        },

        error: (error: any) => {

          console.error(
            'Resume registration token validation failed:',
            error
          );

          localStorage.removeItem('mwi_token');
          sessionStorage.removeItem('mwi_registration_draft');

          this.router.navigate(['/login']);
        }
      });

    }

  }

  private loadRegistrationDraft(): void {

    const existing =
      sessionStorage.getItem('mwi_registration_draft');

    if (!existing) {
      return;
    }

    try {

      const draft = JSON.parse(existing);

      // =========================
      // BASIC DETAILS
      // =========================

      if (draft.profileFor !== undefined) {
        this.profileFor = draft.profileFor;
      }

      if (draft.gender !== undefined) {
        this.gender = draft.gender;
      }

      if (draft.fullName !== undefined) {
        this.fullName = draft.fullName;
      }

      if (draft.maritalStatus !== undefined) {
        this.maritalStatus = draft.maritalStatus;
      }

      if (draft.hasKids !== undefined) {
        this.hasKids = draft.hasKids;
      }

      if (draft.numberOfKids !== undefined) {
        this.numberOfKids = draft.numberOfKids;
      }

      if (draft.kidsLivingStatus !== undefined) {
        this.kidsLivingStatus =
          draft.kidsLivingStatus;
      }

      if (draft.dobDay !== undefined) {
        this.dobDay = draft.dobDay;
      }

      if (draft.dobMonth !== undefined) {
        this.dobMonth = draft.dobMonth;
      }

      if (draft.dobYear !== undefined) {
        this.dobYear = draft.dobYear;
      }

      if (draft.heightInches !== undefined) {
        this.heightInches = draft.heightInches;
      }

      // Recalculate age
      if (
        this.dobDay &&
        this.dobMonth &&
        this.dobYear
      ) {
        this.calculateAge();
      }


      // =========================
      // LOCATION
      // =========================

      if (draft.location) {

        this.locationMethod =
          draft.location.locationMethod || '';

        this.latitude =
          draft.location.latitude ?? null;

        this.longitude =
          draft.location.longitude ?? null;

        this.district =
          draft.location.district || '';

        this.state =
          draft.location.state || 'Kerala';

        this.pincode =
          draft.location.pincode || '';

        this.place =
          draft.location.place || '';

        this.houseName =
          draft.location.houseName || '';

        if (
          this.district ||
          this.pincode ||
          this.place ||
          this.houseName
        ) {
          this.showLocationDetails = true;
        }

      }


      // =========================
      // RELIGION
      // =========================

      if (draft.religion) {

        this.religion =
          draft.religion.religion || '';

        this.muslimSect =
          draft.religion.muslimSect || '';

        this.sunniGroup =
          draft.religion.sunniGroup || '';

        this.salafiGroup =
          draft.religion.salafiGroup || '';

        this.hinduCaste =
          draft.religion.hinduCaste || '';

        this.hinduSubCaste =
          draft.religion.hinduSubCaste || '';

        this.nakshatra =
          draft.religion.nakshatra || '';

        this.rashi =
          draft.religion.rashi || '';

        this.dosham =
          draft.religion.dosham || '';

        this.christianDenomination =
          draft.religion.christianDenomination || '';

        this.christianSubDenomination =
          draft.religion.christianSubDenomination || '';

        this.otherChristianChurch =
          draft.religion.otherChristianChurch || '';

      }


      // =========================
      // EDUCATION
      // =========================

      if (draft.education) {

        this.highestEducation =
          draft.education.highestEducation || '';

        this.specialization =
          draft.education.specialization || '';

        this.jobTitle =
          draft.education.jobTitle || '';

        this.jobSector =
          draft.education.jobSector || '';

      }


      // =========================
      // PREFERENCES
      // =========================

      if (draft.preferences) {

        this.preferredAgeMin =
          draft.preferences.ageMin || '';

        this.preferredAgeMax =
          draft.preferences.ageMax || '';

        this.preferredHeightMin =
          draft.preferences.heightMin || '';

        this.preferredHeightMax =
          draft.preferences.heightMax || '';

        this.preferredMaritalStatuses =
          Array.isArray(
            draft.preferences.maritalStatuses
          )
            ? [...draft.preferences.maritalStatuses]
            : [];

        this.acceptanceOfKids =
          draft.preferences.acceptanceOfKids || '';

        this.preferredReligion =
          draft.preferences.religion || '';

        this.preferredSects =
          Array.isArray(
            draft.preferences.preferredSects
          )
            ? [...draft.preferences.preferredSects]
            : [];

        this.preferredSunniGroups =
          Array.isArray(
            draft.preferences.preferredSunniGroups
          )
            ? [...draft.preferences.preferredSunniGroups]
            : [];

        this.preferredSalafiGroups =
          Array.isArray(
            draft.preferences.preferredSalafiGroups
          )
            ? [...draft.preferences.preferredSalafiGroups]
            : [];

        this.preferredCastes =
          Array.isArray(
            draft.preferences.preferredCastes
          )
            ? [...draft.preferences.preferredCastes]
            : [];

        this.preferredSubCastes =
          Array.isArray(
            draft.preferences.preferredSubCastes
          )
            ? [...draft.preferences.preferredSubCastes]
            : [];

        this.preferredEducation =
          Array.isArray(
            draft.preferences.preferredEducation
          )
            ? [...draft.preferences.preferredEducation]
            : [];

        this.preferredEducationSpecific =
          Array.isArray(
            draft.preferences.preferredEducationSpecific
          )
            ? [...draft.preferences.preferredEducationSpecific]
            : [];

        this.preferredCareerSectors =
          Array.isArray(
            draft.preferences.preferredCareerSectors
          )
            ? [...draft.preferences.preferredCareerSectors]
            : [];
        console.log(
          '🔥 PREFERRED LOCATIONS SENT:',
          this.preferredLocations
        );
        this.preferredLocations =
          Array.isArray(
            draft.preferences.preferredLocations
          )
            ? [...draft.preferences.preferredLocations]
            : [];

      }

      console.log(
        'Registration draft restored:',
        draft
      );

    } catch (error) {

      console.error(
        'Unable to restore registration draft:',
        error
      );

      sessionStorage.removeItem(
        'mwi_registration_draft'
      );

    }

  }

  // =========================
  // MOBILE CHECK
  // =========================

  continueRegistration(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const phone = this.phone.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      this.errorMessage =
        'Please enter a valid 10 digit mobile number.';
      return;
    }

    this.loading = true;

    this.apiService.sendOtp({
      phone: phone,
      purpose: 'registration'
    }).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log('Send OTP API Response:', response);

        if (response.success === true) {

          this.errorMessage = '';

          this.successMessage =
            'OTP sent successfully.';

          this.step = 'otp';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          response.message ||
          'Unable to send OTP.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('Send OTP API Error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }

  // =========================
  // OTP VERIFY
  // // =========================
  verifyOtp(): void {

    this.errorMessage = '';
    this.successMessage = '';

    const phone = this.phone.trim();
    const otp = this.otp.trim();

    if (!/^[0-9]{6}$/.test(otp)) {

      this.errorMessage =
        'Please enter the 6 digit OTP.';

      return;
    }

    this.loading = true;

    this.apiService.verifyOtp({
      phone: phone,
      otp: otp,
      purpose: 'registration'
    }).subscribe({

      next: (response) => {

        this.loading = false;

        console.log(
          'Verify OTP API Response:',
          response
        );

        if (response.success === true) {

          this.errorMessage = '';
          this.successMessage = '';

          this.step = 'password';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          response.message ||
          'OTP verification failed.';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Verify OTP API Error:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }

  validatePassword(): boolean {

    this.errorMessage = '';

    if (!this.password) {

      this.errorMessage =
        'Please create a password.';

      return false;
    }

    if (this.password.length < 8) {

      this.errorMessage =
        'Password must be at least 8 characters.';

      return false;
    }

    if (!/[A-Z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one uppercase letter.';

      return false;
    }

    if (!/[a-z]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one lowercase letter.';

      return false;
    }

    if (!/[0-9]/.test(this.password)) {

      this.errorMessage =
        'Password must contain at least one number.';

      return false;
    }

    if (this.password !== this.confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return false;
    }

    return true;
  }

  continueFromPassword(): void {

    if (!this.validatePassword()) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    this.apiService.register({
      phone: this.phone.trim(),
      password: this.password,
      otp: this.otp.trim()
    }).subscribe({

      next: (response: any) => {

        this.loading = false;

        console.log('Register API Response:', response);

        if (response.success === true) {

          // Save authenticated user session and token.
          if (response.data?.token && response.data?.user) {
            this.authService.loginUser(response);
          }

          // Store the member ID returned by backend.
          this.memberId =
            response.data?.user?.member_id || '';

          this.successMessage = '';

          this.step = 'basic';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          response.message ||
          'Unable to create your account.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'Register API Error:',
          error
        );

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to create your account. Please try again.';

        this.cdr.detectChanges();
      }

    });
  }
  // =========================
  // PROFILE FOR
  // =========================

  onProfileForChange(): void {
    this.calculateAge();

    if (
      this.profileFor === 'sister' ||
      this.profileFor === 'daughter'
    ) {

      this.gender = 'female';

      return;
    }

    if (
      this.profileFor === 'brother' ||
      this.profileFor === 'son'
    ) {

      this.gender = 'male';

      return;
    }

    // Self / Friend / Relative
    this.gender = '';


  }


  // =========================
  // MARITAL STATUS
  // =========================

  onMaritalStatusChange(): void {

    /*
     * Kids question is NOT required for:
     * Never Married
     * Nikah Divorce
     */

    if (
      this.maritalStatus === 'never_married' ||
      this.maritalStatus === 'nikah_divorce'
    ) {

      this.hasKids = '';
      this.numberOfKids = '';
      this.kidsLivingStatus = '';

      return;
    }

    /*
     * Reset when changing status
     */
    this.hasKids = '';
    this.numberOfKids = '';
    this.kidsLivingStatus = '';
  }


  // =========================
  // BASIC DETAILS VALIDATION
  // =========================

  goToLocation(): void {

    this.errorMessage = '';

    if (!this.profileFor) {

      this.errorMessage =
        'Please select who this profile is for.';

      return;
    }

    if (!this.gender) {

      this.errorMessage =
        'Please select gender.';

      return;
    }

    if (!this.fullName.trim()) {

      this.errorMessage =
        'Please enter the name.';

      return;
    }
    const fullName = this.fullName.trim();
    if (fullName.length < 2 || fullName.length > 100) {
      this.errorMessage = 'Full name must be between 2 and 100 characters.';
      return;
    }
    if (!this.maritalStatus) {

      this.errorMessage =
        'Please select marital status.';

      return;
    }

    /*
     * Kids validation only when required
     */

    const kidsRequired =
      this.maritalStatus === 'divorced' ||
      this.maritalStatus === 'widowed' ||
      this.maritalStatus === 'separated' ||
      this.maritalStatus === 'awaiting_divorce';


    if (kidsRequired && !this.hasKids) {

      this.errorMessage =
        'Please select whether the person has kids.';

      return;
    }


    if (
      kidsRequired &&
      this.hasKids === 'yes' &&
      !this.numberOfKids
    ) {

      this.errorMessage =
        'Please select the number of kids.';

      return;
    }


    if (
      kidsRequired &&
      this.hasKids === 'yes' &&
      !this.kidsLivingStatus
    ) {

      this.errorMessage =
        'Please select kids living status.';

      return;
    }


    if (
      !this.dobDay ||
      !this.dobMonth ||
      !this.dobYear
    ) {

      this.errorMessage =
        'Please select date of birth.';

      return;
    }


    if (this.dobError) {

      return;
    }

    if (this.calculatedAge === null) {

      this.errorMessage =
        'Please select your date of birth.';

      return;
    }

    const minimumAge =
      this.gender === 'male' ? 21 : 18;

    if (this.calculatedAge < minimumAge) {

      this.errorMessage =
        this.gender === 'male'
          ? 'A male profile must be at least 21 years old.'
          : 'A female profile must be at least 18 years old.';

      return;
    }

    if (!this.heightInches) {

      this.errorMessage =
        'Please select height.';

      return;
    }


    const basicData = {
      profileFor: this.profileFor,
      gender: this.gender,
      fullName: this.fullName.trim(),
      maritalStatus: this.maritalStatus,
      hasKids: this.hasKids || null,

      numberOfKids:
        this.numberOfKids === '3_plus'
          ? 3
          : Number(this.numberOfKids) || null,

      kidsLivingStatus: this.kidsLivingStatus || null,
      dobDay: this.dobDay,
      dobMonth: this.dobMonth,
      dobYear: this.dobYear,
      heightInches: this.heightInches
    };

    this.loading = true;
    this.errorMessage = '';

    this.apiService.saveBasic(basicData).subscribe({
      next: (response: any) => {

        this.loading = false;

        if (response?.success === true) {
          this.step = 'location';
          this.cdr.detectChanges();
          return;
        }

        this.errorMessage =
          response?.message || 'Unable to save basic details.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('Basic save error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to save basic details.';

        this.cdr.detectChanges();
      }
    });


  }

  saveRegistrationDraft(): void {
    const draft = {
      profileFor: this.profileFor,
      gender: this.gender,
      fullName: this.fullName,
      maritalStatus: this.maritalStatus,
      hasKids: this.hasKids,
      numberOfKids: this.numberOfKids,
      kidsLivingStatus: this.kidsLivingStatus,

      dobDay: this.dobDay,
      dobMonth: this.dobMonth,
      dobYear: this.dobYear,
      heightInches: this.heightInches
    };

    sessionStorage.setItem(
      'mwi_registration_draft',
      JSON.stringify(draft)
    );
  }
  useCurrentLocation(): void {

    this.locationMethod = 'current';

    this.showLocationDetails = false;

    this.showLocationModal = true;

    this.locationModalType = 'current';

    this.locationProcessing = true;

    this.locationError = '';

    if (!navigator.geolocation) {

      this.locationProcessing = false;

      this.locationError =
        'Location services are not supported by this browser.';

      this.showLocationModal = false;

      this.cdr.detectChanges();

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude =
          position.coords.latitude;

        this.longitude =
          position.coords.longitude;


        console.log(
          'Latitude:',
          this.latitude
        );

        console.log(
          'Longitude:',
          this.longitude
        );


        // Reverse geocoding

        this.reverseGeocode(
          this.latitude,
          this.longitude
        );

      },

      (error) => {

        console.error(
          'Location error:',
          error
        );

        this.locationProcessing = false;

        this.showLocationModal = false;

        this.locationMethod = '';

        this.locationError =
          'Unable to get your location. Please allow location access or enter the location manually.';

        this.cdr.detectChanges();

      },

      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000
      }

    );

  }

  private reverseGeocode(
    latitude: number,
    longitude: number
  ): void {

    const url =
      'https://nominatim.openstreetmap.org/reverse';

    const params = {
      format: 'jsonv2',
      lat: latitude.toString(),
      lon: longitude.toString(),
      addressdetails: '1',
      zoom: '18',
      'accept-language': 'en'
    };

    this.http.get<any>(
      url,
      { params }
    ).subscribe({

      next: (response) => {

        console.log(
          'Reverse geocoding response:',
          response
        );

        const address =
          response?.address;

        if (!address) {

          this.handleLocationError(
            'Unable to determine your address from the selected location.'
          );

          return;
        }


        // =========================
        // STATE
        // =========================

        this.state =
          address.state || '';


        // =========================
        // KERALA VALIDATION
        // =========================

        if (
          this.state.trim().toLowerCase() !==
          'kerala'
        ) {

          this.handleLocationError(
            'Please select a location within Kerala.'
          );

          return;
        }


        // =========================
        // PINCODE
        // =========================

        this.pincode =
          address.postcode || '';


        // =========================
        // DISTRICT
        // =========================

        const detectedDistrict =
          this.findDistrict(address);

        if (!detectedDistrict) {

          this.handleLocationError(
            'Unable to determine your district. Please enter the location manually.'
          );

          return;
        }

        this.district =
          detectedDistrict;


        // =========================
        // PLACE
        // =========================

        this.place =
          address.village ||
          address.town ||
          address.city ||
          address.suburb ||
          address.municipality ||
          '';


        // =========================
        // SUCCESS
        // =========================

        this.locationProcessing = false;

        this.showLocationModal = false;

        this.showLocationDetails = true;

        this.locationMethod = 'map';

        this.locationError = '';

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Reverse geocoding error:',
          error
        );

        this.handleLocationError(
          'Unable to detect your address. Please enter the location manually.'
        );

      }

    });

  }
  private findDistrict(
    address: any
  ): string {

    const possibleDistricts = [

      address.state_district,

      address.county,

      address.city_district,

      address.district,

      address.city

    ];


    for (
      const value of possibleDistricts
    ) {

      if (!value) {
        continue;
      }


      const normalized =
        value
          .toLowerCase()
          .trim();


      const matchedDistrict =
        this.districts.find(
          district =>
            district.toLowerCase() === normalized
        );


      if (matchedDistrict) {

        return matchedDistrict;

      }

    }


    return '';

  }
  private handleLocationError(
    message: string
  ): void {

    this.locationProcessing = false;

    this.locationError = message;

    this.showLocationDetails = true;

    this.cdr.detectChanges();

  }

  calculateAge(): void {

    this.dobError = '';
    this.calculatedAge = null;

    if (
      !this.dobDay ||
      !this.dobMonth ||
      !this.dobYear
    ) {
      return;
    }

    const birthDate = new Date(
      Number(this.dobYear),
      Number(this.dobMonth) - 1,
      Number(this.dobDay)
    );

    const today = new Date();

    // Invalid date check
    if (
      birthDate.getFullYear() !== Number(this.dobYear) ||
      birthDate.getMonth() !== Number(this.dobMonth) - 1 ||
      birthDate.getDate() !== Number(this.dobDay)
    ) {

      this.dobError = 'Please select a valid date of birth.';

      return;
    }

    if (birthDate > today) {

      this.dobError =
        'Date of birth cannot be in the future.';

      return;
    }

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate()
      )
    ) {
      age--;
    }
    if (age > 60) {
      this.dobError = 'Age must not be more than 60 years.';
      return;
    }

    this.calculatedAge = age;

    // Legal minimum age
    const minimumAge =
      this.gender === 'male' ? 21 :
        this.gender === 'female' ? 18 :
          null;

    if (
      minimumAge !== null &&
      age < minimumAge
    ) {

      this.dobError =
        this.gender === 'male'
          ? 'A male profile must be at least 21 years old.'
          : 'A female profile must be at least 18 years old.';
    }
  }


  cancelLocation(): void {

    this.showLocationModal = false;

    this.locationProcessing = false;

    this.locationMethod = '';

    this.showLocationDetails = false;

    this.locationError = '';

    this.cdr.detectChanges();
  }
  selectOnMap(): void {

    this.locationMethod = 'map';

    this.showLocationDetails = false;

    this.showLocationModal = true;

    this.locationModalType = 'map';

    this.locationError = '';

    this.selectedMapLatitude = null;

    this.selectedMapLongitude = null;
    this.district = '';
    this.pincode = '';
    this.place = '';
    this.houseName = '';
    this.state = 'Kerala';

    this.mapInitializationPending = true;

    this.cdr.detectChanges();

  }
  ngAfterViewChecked(): void {

    if (
      this.mapInitializationPending &&
      this.showLocationModal &&
      this.locationModalType === 'map'
    ) {

      const mapElement =
        document.getElementById('register-map');

      if (!mapElement) {
        return;
      }

      this.mapInitializationPending = false;

      this.initializeMap();

    }

  }

  private initializeMap(): void {

    const mapElement =
      document.getElementById('register-map');

    if (!mapElement) {

      console.error(
        'Map container #register-map not found.'
      );

      return;
    }


    // Remove old map if exists

    if (this.map) {

      this.map.remove();

      this.map = null;

    }


    // Create map ONCE

    this.map = L.map(
      mapElement,
      {
        zoomControl: true
      }
    ).setView(
      [10.8505, 76.2711],
      8
    );


    // OpenStreetMap tiles

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors',

        maxZoom: 19
      }
    ).addTo(this.map);


    // Map click = marker only

    this.map.on(
      'click',
      (event: L.LeafletMouseEvent) => {

        this.selectMapLocation(
          event.latlng.lat,
          event.latlng.lng
        );

      }
    );


    // Fix map size after modal rendering

    setTimeout(() => {

      this.map?.invalidateSize();

    }, 200);

  }
  private selectMapLocation(
    latitude: number,
    longitude: number
  ): void {

    this.selectedMapLatitude = latitude;
    this.selectedMapLongitude = longitude;

    // Remove previous marker
    if (this.mapMarker) {
      this.mapMarker.remove();
      this.mapMarker = null;
    }

    // Create visible SVG marker
    const markerIcon = L.divIcon({
      className: '',
      html: `
      <div style="
        width:40px;
        height:48px;
        position:relative;
      ">
        <svg
          width="40"
          height="48"
          viewBox="0 0 40 48"
          xmlns="http://www.w3.org/2000/svg"
          style="
            display:block;
            width:40px;
            height:48px;
          "
        >

          <!-- Pin -->
          <path
            d="
              M20 1
              C10 1 3 9 3 19
              C3 31 20 47 20 47
              C20 47 37 31 37 19
              C37 9 30 1 20 1
              Z
            "
            fill="#7c3aed"
            stroke="#ffffff"
            stroke-width="3"
          />

          <!-- Center -->
          <circle
            cx="20"
            cy="19"
            r="7"
            fill="#ffffff"
          />

        </svg>
      </div>
    `,

      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48]
    });

    this.mapMarker = L.marker(
      [latitude, longitude],
      {
        icon: markerIcon
      }
    ).addTo(this.map!);

    console.log(
      'Map marker moved:',
      latitude,
      longitude
    );
  }
  cancelMap(): void {
    this.mapInitializationPending = false;

    if (this.map) {

      this.map.remove();

      this.map = null;

    }


    this.mapMarker = null;

    this.selectedMapLatitude = null;

    this.selectedMapLongitude = null;

    this.showLocationModal = false;

    this.locationMethod = '';

    this.showLocationDetails = false;

    this.locationError = '';

    this.cdr.detectChanges();

  }
  useManualLocation(): void {

    this.locationMethod = 'manual';

    this.showLocationDetails = true;

    this.showLocationModal = false;

    this.latitude = null;

    this.longitude = null;

    this.locationError = '';

    this.district = '';
    this.state = 'Kerala';
    this.pincode = '';

    this.cdr.detectChanges();
  }
  confirmMapLocation(): void {

    if (
      this.selectedMapLatitude === null ||
      this.selectedMapLongitude === null
    ) {

      this.locationError =
        'Please select a location on the map first.';

      return;
    }

    this.latitude =
      this.selectedMapLatitude;

    this.longitude =
      this.selectedMapLongitude;

    this.locationMethod = 'map';

    this.locationError = '';

    this.locationProcessing = true;

    // Close map ONLY after button click
    this.showLocationModal = false;

    this.showLocationDetails = true;

    this.cdr.detectChanges();

    // Get address
    this.reverseGeocode(
      this.latitude,
      this.longitude
    );
  }
  get filteredDistricts(): string[] {

    const search = this.district
      .trim()
      .toLowerCase();

    if (!search) {
      return this.districts;
    }

    return this.districts.filter(
      district =>
        district.toLowerCase().includes(search)
    );
  }

  selectDistrict(district: string): void {

    this.district = district;

    this.showDistrictSuggestions = false;

    this.cdr.detectChanges();
  }

  saveLocationDraft(): void {
    const existing = sessionStorage.getItem(
      'mwi_registration_draft'
    );

    const draft = existing
      ? JSON.parse(existing)
      : {};

    draft.location = {
      locationMethod: this.locationMethod,
      latitude: this.latitude,
      longitude: this.longitude,
      district: this.district,
      state: this.state,
      pincode: this.pincode,
      place: this.place,
      houseName: this.houseName
    };

    sessionStorage.setItem(
      'mwi_registration_draft',
      JSON.stringify(draft)
    );
  }

  goToReligion(): void {

    this.locationError = '';

    if (!this.locationMethod) {

      this.locationError =
        'Please select a location method.';

      return;
    }

    if (!this.district.trim()) {

      this.locationError =
        'Please enter/select district.';

      return;
    }

    if (!/^[0-9]{6}$/.test(this.pincode)) {

      this.locationError =
        'Please enter a valid 6 digit pincode.';

      return;
    }

    if (!this.houseName.trim()) {

      this.locationError =
        'Please enter house name.';

      return;
    }
    const houseName = this.houseName.trim();

    if (houseName.length < 1 || houseName.length > 150) {
      this.locationError = 'House name must be between 1 and 150 characters.';
      return;
    }
    if (!this.place.trim()) {

      this.locationError =
        'Please enter place.';

      return;
    }
    const place = this.place.trim();

    if (place.length < 1 || place.length > 100) {
      this.locationError = 'Place must be between 1 and 100 characters.';
      return;
    }
    // District must be from allowed list

    if (!this.districts.includes(this.district)) {

      this.locationError =
        'Please select a valid district.';

      return;
    }

    const locationData = {
      locationMethod: this.locationMethod,
      latitude: this.latitude,
      longitude: this.longitude,
      district: this.district,
      state: this.state,
      pincode: this.pincode,
      place: this.place,
      houseName: this.houseName
    };

    this.loading = true;
    this.locationError = '';

    this.apiService.saveLocation(locationData).subscribe({
      next: (response: any) => {

        this.loading = false;

        if (response?.success === true) {
          this.saveLocationDraft();
          this.step = 'religion';
          this.cdr.detectChanges();
          return;
        }

        this.locationError =
          response?.message || 'Unable to save location details.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('Location save error:', error);

        this.loading = false;

        this.locationError =
          error?.error?.message ||
          'Unable to save location details.';

        this.cdr.detectChanges();
      }
    });
  }
  onReligionChange(): void {

    this.muslimSect = '';
    this.sunniGroup = '';
    this.salafiGroup = '';

    this.hinduCaste = '';
    this.hinduSubCaste = '';

    this.christianDenomination = '';
    this.christianSubDenomination = '';
    this.otherChristianChurch = '';

    this.nakshatra = '';
    this.rashi = '';
    this.dosham = '';
  }
  getHinduSubCastes(): string[] {

    switch (this.hinduCaste) {

      case 'Nair':
        return this.nairSubCastes;

      case 'Viswakarma':
        return this.viswakarmaSubCastes;

      case 'SC':
        return this.scSubCastes;

      case 'ST':
        return this.stSubCastes;

      default:
        return [];
    }
  }
  saveReligionDraft(): void {
    const existing = sessionStorage.getItem(
      'mwi_registration_draft'
    );

    const draft = existing
      ? JSON.parse(existing)
      : {};

    draft.religion = {
      religion: this.religion,

      muslimSect: this.muslimSect,
      sunniGroup: this.sunniGroup,
      salafiGroup: this.salafiGroup,

      hinduCaste: this.hinduCaste,
      hinduSubCaste: this.hinduSubCaste,

      nakshatra: this.nakshatra,
      rashi: this.rashi,
      dosham: this.dosham,

      christianDenomination:
        this.christianDenomination,
      christianSubDenomination:
        this.christianSubDenomination,
      otherChristianChurch:
        this.otherChristianChurch
    };

    sessionStorage.setItem(
      'mwi_registration_draft',
      JSON.stringify(draft)
    );
  }
  goToEducation(): void {

    this.errorMessage = '';

    // =========================
    // RELIGION
    // =========================

    if (!this.religion) {

      this.errorMessage =
        'Please select religion.';

      return;
    }


    // =========================
    // MUSLIM
    // =========================

    if (this.religion === 'Muslim') {

      if (!this.muslimSect) {

        this.errorMessage =
          'Please select sect.';

        return;
      }

      // Sect must be valid

      if (
        !this.muslimSects.includes(
          this.muslimSect
        )
      ) {

        this.errorMessage =
          'Invalid sect selected.';

        return;
      }


      // Sunni hierarchy

      if (
        this.muslimSect === 'Sunni' &&
        !this.sunniGroup
      ) {

        this.errorMessage =
          'Please select Sunni group.';

        return;
      }


      if (
        this.muslimSect === 'Sunni' &&
        !this.sunniGroups.includes(
          this.sunniGroup
        )
      ) {

        this.errorMessage =
          'Invalid Sunni group selected.';

        return;
      }


      // Salafi hierarchy

      if (
        this.muslimSect === 'Salafi' &&
        !this.salafiGroup
      ) {

        this.errorMessage =
          'Please select Salafi group.';

        return;
      }


      if (
        this.muslimSect === 'Salafi' &&
        !this.salafiGroups.includes(
          this.salafiGroup
        )
      ) {

        this.errorMessage =
          'Invalid Salafi group selected.';

        return;
      }

    }


    // =========================
    // HINDU
    // =========================

    if (this.religion === 'Hindu') {

      if (!this.hinduCaste) {

        this.errorMessage =
          'Please select caste.';

        return;
      }


      if (
        !this.hinduCastes.includes(
          this.hinduCaste
        )
      ) {

        this.errorMessage =
          'Invalid caste selected.';

        return;
      }


      // Sub-caste is required only
      // when selected caste has sub-castes

      const allowedSubCastes =
        this.getHinduSubCastes();


      if (
        allowedSubCastes.length > 0 &&
        !this.hinduSubCaste
      ) {

        this.errorMessage =
          'Please select sub-caste.';

        return;
      }


      if (
        this.hinduSubCaste &&
        !allowedSubCastes.includes(
          this.hinduSubCaste
        )
      ) {

        this.errorMessage =
          'Invalid sub-caste selected.';

        return;
      }

    }


    // =========================
    // CHRISTIAN
    // =========================

    if (this.religion === 'Christian') {

      if (!this.christianDenomination) {

        this.errorMessage =
          'Please select denomination.';

        return;
      }


      if (
        !this.christianDenominations.includes(
          this.christianDenomination
        )
      ) {

        this.errorMessage =
          'Invalid denomination selected.';

        return;
      }


      const allowedChristianOptions =
        this.christianOptions[
        this.christianDenomination
        ] || [];


      if (
        allowedChristianOptions.length > 0 &&
        !this.christianSubDenomination
      ) {

        this.errorMessage =
          'Please select sub-denomination.';

        return;
      }


      if (
        this.christianSubDenomination &&
        !allowedChristianOptions.includes(
          this.christianSubDenomination
        )
      ) {

        this.errorMessage =
          'Invalid sub-denomination selected.';

        return;
      }

    }

    const religionData = {
      religion: this.religion,

      muslimSect: this.muslimSect,
      sunniGroup: this.sunniGroup,
      salafiGroup: this.salafiGroup,

      hinduCaste: this.hinduCaste,
      hinduSubCaste: this.hinduSubCaste,

      nakshatra: this.nakshatra,
      rashi: this.rashi,
      dosham: this.dosham,

      christianDenomination: this.christianDenomination,
      christianSubDenomination: this.christianSubDenomination,
      otherChristianChurch: this.otherChristianChurch
    };

    this.loading = true;
    this.errorMessage = '';

    this.apiService.saveReligion(religionData).subscribe({
      next: (response: any) => {

        this.loading = false;

        if (response?.success === true) {
          this.saveReligionDraft();
          this.step = 'education';
          this.cdr.detectChanges();
          return;
        }

        this.errorMessage =
          response?.message || 'Unable to save religion details.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('Religion save error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to save religion details.';

        this.cdr.detectChanges();
      }
    });
  }
  onEducationChange(): void {

    this.specialization = '';

  }

  get currentSpecializations(): string[] {

    return this.specializations[
      this.highestEducation
    ] || [];

  }
  get filteredJobTitles(): string[] {

    const search =
      this.jobTitle
        .trim()
        .toLowerCase();

    if (!search) {

      return [];
    }

    return this.jobTitles
      .filter(title =>
        title.toLowerCase().includes(search)
      )
      .slice(0, 8);
  }


  selectJobTitle(title: string): void {

    this.jobTitle = title;

    this.showJobSuggestions = false;

    this.cdr.detectChanges();

  }
  saveEducationDraft(): void {
    const existing = sessionStorage.getItem(
      'mwi_registration_draft'
    );

    const draft = existing
      ? JSON.parse(existing)
      : {};

    draft.education = {
      highestEducation: this.highestEducation,
      specialization: this.specialization,
      jobTitle: this.jobTitle,
      jobSector: this.jobSector
    };

    sessionStorage.setItem(
      'mwi_registration_draft',
      JSON.stringify(draft)
    );
  }
  goToPreferences(): void {

    this.errorMessage = '';

    if (!this.highestEducation) {

      this.errorMessage =
        'Please select highest education.';

      return;
    }

    if (
      this.currentSpecializations.length > 0 &&
      !this.specialization
    ) {

      this.errorMessage =
        'Please select specialization.';

      return;
    }

    if (!this.jobTitle.trim()) {

      this.errorMessage =
        'Please enter job title or role.';

      return;
    }
    const jobTitle = this.jobTitle.trim();

    if (jobTitle.length < 1 || jobTitle.length > 100) {
      this.errorMessage = 'Job title must be between 1 and 100 characters.';
      return;
    }

    if (!this.jobSector) {

      this.errorMessage =
        'Please select job sector.';

      return;
    }


    // Set defaults ONLY first time

    if (
      !this.preferredAgeMin ||
      !this.preferredAgeMax
    ) {

      this.setDefaultAgePreference();

    }


    if (
      !this.preferredHeightMin ||
      !this.preferredHeightMax
    ) {

      this.setDefaultHeightPreference();

    }


    if (
      this.preferredMaritalStatuses.length === 0
    ) {

      this.setDefaultMaritalPreference();

    }
    this.setDefaultCommunityPreferences();

    if (
      this.preferredLocations.length === 0 &&
      this.district &&
      this.districts.includes(this.district)
    ) {

      this.setDefaultLocationPreference();

    }

    // Religion is always linked to registered religion

    this.preferredReligion =
      this.religion;

    const educationData = {
      highestEducation: this.highestEducation,
      specialization: this.specialization,
      jobTitle: this.jobTitle.trim(),
      jobSector: this.jobSector
    };

    this.loading = true;
    this.errorMessage = '';

    this.apiService.saveEducation(educationData).subscribe({
      next: (response: any) => {

        this.loading = false;

        if (response?.success === true) {
          this.saveEducationDraft();
          this.step = 'preferences';
          this.cdr.detectChanges();
          return;
        }

        this.errorMessage =
          response?.message || 'Unable to save education details.';

        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error('Education save error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to save education details.';

        this.cdr.detectChanges();
      }
    });

  }
  setDefaultAgePreference(): void {

    if (this.calculatedAge === null) {
      return;
    }

    let minAge: number;
    let maxAge: number;

    if (this.gender === 'male') {

      minAge = this.calculatedAge - 8;
      maxAge = this.calculatedAge;

    } else {

      minAge = this.calculatedAge;
      maxAge = this.calculatedAge + 8;
    }

    minAge = Math.max(18, minAge);
    maxAge = Math.min(60, maxAge);

    this.preferredAgeMin = String(minAge);
    this.preferredAgeMax = String(maxAge);
  }
  setDefaultHeightPreference(): void {

    if (!this.heightInches) {
      return;
    }

    const ownHeight =
      Number(this.heightInches);

    if (this.gender === 'male') {

      this.preferredHeightMin = '48';
      this.preferredHeightMax =
        String(ownHeight);

    } else {

      this.preferredHeightMin =
        String(ownHeight);

      this.preferredHeightMax = '87';
    }
  }
  setDefaultLocationPreference(): void {

    if (!this.district) {
      return;
    }

    if (
      !this.districts.includes(this.district)
    ) {
      return;
    }

    if (
      !this.preferredLocations.includes(
        this.district
      )
    ) {

      this.preferredLocations = [
        this.district
      ];

    }

  }
  getEducationSpecificOptions(): string[] {

    const options: string[] = [];

    this.preferredEducation.forEach(
      (education) => {

        const specific =
          this.educationSpecificOptions[
          education
          ];

        if (specific) {

          specific.forEach(
            (item) => {

              if (!options.includes(item)) {
                options.push(item);
              }

            }
          );

        }

      }
    );

    return options;

  }

  setDefaultMaritalPreference(): void {

    this.preferredMaritalStatuses = [
      this.maritalStatus
    ];

  }
  get showKidsAcceptance(): boolean {

    return this.preferredMaritalStatuses.some(
      status => status !== 'never_married'
    );

  }
  ageOptions = Array.from(
    { length: 43 },
    (_, i) => i + 18
  );
  toggleMaritalStatus(status: string): void {

    const index =
      this.preferredMaritalStatuses.indexOf(status);

    if (index >= 0) {

      this.preferredMaritalStatuses.splice(index, 1);

    } else {

      this.preferredMaritalStatuses.push(status);

    }

    // Remove kids acceptance if only Never Married
    if (!this.showKidsAcceptance) {

      this.acceptanceOfKids = '';

    }

  }

  showPreferredLocationSuggestions = false;


  get filteredPreferredLocations(): string[] {

    const search =
      this.preferredLocationInput
        .trim()
        .toLowerCase();

    const locations = [
      'All Kerala',
      ...this.districts
    ];

    if (!search) {
      return locations.filter(
        location =>
          !this.preferredLocations.includes(location)
      );
    }

    return locations.filter(
      location =>
        location.toLowerCase().includes(search) &&
        !this.preferredLocations.includes(location)
    );
  }


  selectPreferredLocation(
    district: string
  ): void {

    if (
      !this.preferredLocations.includes(district)
    ) {

      this.preferredLocations.push(district);

    }

    this.preferredLocationInput = '';

    this.showPreferredLocationSuggestions = false;

    this.cdr.detectChanges();
  }


  removePreferredLocation(
    location: string
  ): void {

    this.preferredLocations =
      this.preferredLocations.filter(
        item => item !== location
      );

  }
  getPreferredCommunityOptions(): string[] {

    if (this.religion === 'Muslim') {
      return this.preferredMuslimSectOptions;
    }

    if (this.religion === 'Hindu') {
      return this.preferredHinduCasteOptions;
    }

    if (this.religion === 'Christian') {
      return this.preferredChristianDenominationOptions;
    }

    return [];
  }
  getPreferredSubCastes(): string[] {

    if (
      this.religion !== 'Hindu' ||
      this.preferredCastes.length !== 1 ||
      this.preferredCastes[0] === 'Any'
    ) {
      return [];
    }

    const subCastes =
      this.getHinduSubCastesForCaste(
        this.preferredCastes[0]
      );

    return subCastes.length > 0
      ? ['Any', ...subCastes]
      : [];
  }
  togglePreferredCommunity(
    value: string
  ): void {

    // Keep the existing generic entry point; Muslim uses the same
    // preferred-sect selection logic.
    this.togglePreferredSect(value);
  }

  togglePreferredSect(
    sect: string
  ): void {

    if (!this.preferredMuslimSectOptions.includes(sect)) {
      return;
    }

    if (sect === 'Any') {
      this.preferredSects =
        this.preferredSects.includes('Any') ? [] : ['Any'];
      this.preferredSunniGroups = [];
      this.preferredSalafiGroups = [];
      return;
    }

    this.preferredSects =
      this.preferredSects.filter(item => item !== 'Any');

    if (this.preferredSects.includes(sect)) {
      this.preferredSects =
        this.preferredSects.filter(item => item !== sect);

      if (sect === 'Sunni') this.preferredSunniGroups = [];
      if (sect === 'Salafi') this.preferredSalafiGroups = [];
    } else {
      this.preferredSects.push(sect);
    }

    if (this.preferredSects.length > 1) {
      this.preferredSunniGroups = [];
      this.preferredSalafiGroups = [];
    }
  }

  togglePreferredSunniGroup(
    group: string
  ): void {

    if (!this.preferredSunniGroupOptions.includes(group)) return;

    if (group === 'Any') {
      this.preferredSunniGroups =
        this.preferredSunniGroups.includes('Any') ? [] : ['Any'];
      return;
    }

    this.preferredSunniGroups =
      this.preferredSunniGroups.filter(item => item !== 'Any');

    if (this.preferredSunniGroups.includes(group)) {
      this.preferredSunniGroups =
        this.preferredSunniGroups.filter(item => item !== group);
    } else {
      this.preferredSunniGroups.push(group);
    }
  }

  togglePreferredSalafiGroup(
    group: string
  ): void {

    if (!this.preferredSalafiGroupOptions.includes(group)) return;

    if (group === 'Any') {
      this.preferredSalafiGroups =
        this.preferredSalafiGroups.includes('Any') ? [] : ['Any'];
      return;
    }

    this.preferredSalafiGroups =
      this.preferredSalafiGroups.filter(item => item !== 'Any');

    if (this.preferredSalafiGroups.includes(group)) {
      this.preferredSalafiGroups =
        this.preferredSalafiGroups.filter(item => item !== group);
    } else {
      this.preferredSalafiGroups.push(group);
    }
  }

  togglePreferredCaste(
    caste: string
  ): void {

    if (!this.preferredHinduCasteOptions.includes(caste)) return;

    if (caste === 'Any') {
      this.preferredCastes =
        this.preferredCastes.includes('Any') ? [] : ['Any'];
      this.preferredSubCastes = [];
      return;
    }

    this.preferredCastes =
      this.preferredCastes.filter(item => item !== 'Any');

    if (this.preferredCastes.includes(caste)) {
      this.preferredCastes =
        this.preferredCastes.filter(item => item !== caste);

      const allowedForRemaining =
        this.preferredCastes.flatMap(item =>
          this.getHinduSubCastesForCaste(item)
        );

      this.preferredSubCastes =
        this.preferredSubCastes.filter(sub =>
          sub === 'Any' || allowedForRemaining.includes(sub)
        );
    } else {
      this.preferredCastes.push(caste);
    }

    if (this.preferredCastes.length > 1) {
      this.preferredSubCastes = [];
    }
  }

  togglePreferredSubCaste(
    subCaste: string
  ): void {

    const allowedSubCastes = this.getPreferredSubCastes();

    if (!allowedSubCastes.includes(subCaste)) return;

    if (subCaste === 'Any') {
      this.preferredSubCastes =
        this.preferredSubCastes.includes('Any') ? [] : ['Any'];
      return;
    }

    this.preferredSubCastes =
      this.preferredSubCastes.filter(item => item !== 'Any');

    if (this.preferredSubCastes.includes(subCaste)) {
      this.preferredSubCastes =
        this.preferredSubCastes.filter(item => item !== subCaste);
    } else {
      this.preferredSubCastes.push(subCaste);
    }
  }

  getHinduSubCastesForCaste(
    caste: string
  ): string[] {

    const map: Record<string, string[]> = {

      'Thiyya / Ezhava': [],

      'Namboothiri': [],

      'Nair': [
        'Menon',
        'Pillai',
        'Panikkar',
        'Nambiar',
        'Kurupp',
        'Vilakithala Nair',
        'Veluthedath Nair'
      ],

      'Viswakarma': [
        'Asari (Carpenters)',
        'Kollan (Blacksmiths)',
        'Moosari (Bell metal and brass smiths)',
        'Thattan (Goldsmiths)',
        'Kallassary (Stonemasons)'
      ],

      'SC': [
        'Pulayan / Pulayar',
        'Cheruman',
        'Kanakkan',
        'Kuravan',
        'Parayan',
        'Others'
      ],

      'ST': [
        'Paniyan',
        'Irular',
        'Kurichiar',
        'Kanikkaran',
        'Other'
      ],

      'Other': []

    };

    return map[caste] || [];
  }
  togglePreferredDenomination(
    denomination: string
  ): void {

    if (!this.preferredChristianDenominationOptions.includes(denomination)) {
      return;
    }

    if (denomination === 'Any') {
      this.preferredSects =
        this.preferredSects.includes('Any') ? [] : ['Any'];
      this.preferredSubCastes = [];
      return;
    }

    this.preferredSects =
      this.preferredSects.filter(item => item !== 'Any');

    if (this.preferredSects.includes(denomination)) {
      this.preferredSects =
        this.preferredSects.filter(item => item !== denomination);

      const allowed = this.preferredSects.flatMap(
        item => this.christianOptions[item] || []
      );

      this.preferredSubCastes =
        this.preferredSubCastes.filter(
          item => item === 'Any' || allowed.includes(item)
        );
    } else {
      this.preferredSects.push(denomination);
    }

    if (this.preferredSects.length > 1) {
      this.preferredSubCastes = [];
    }
  }

  togglePreferredSubDenomination(
    subDenomination: string
  ): void {

    const allowed = this.getPreferredChristianSubDenominations();

    if (!allowed.includes(subDenomination)) return;

    if (subDenomination === 'Any') {
      this.preferredSubCastes =
        this.preferredSubCastes.includes('Any') ? [] : ['Any'];
      return;
    }

    this.preferredSubCastes =
      this.preferredSubCastes.filter(item => item !== 'Any');

    if (this.preferredSubCastes.includes(subDenomination)) {
      this.preferredSubCastes =
        this.preferredSubCastes.filter(item => item !== subDenomination);
    } else {
      this.preferredSubCastes.push(subDenomination);
    }
  }

  getPreferredChristianSubDenominations(): string[] {

    if (
      this.preferredSects.length !== 1 ||
      this.preferredSects[0] === 'Any'
    ) {
      return [];
    }

    const options =
      this.christianOptions[this.preferredSects[0]] || [];

    return options.length > 0 ? ['Any', ...options] : [];
  }

  togglePreferredEducation(
    education: string
  ): void {

    if (
      !this.preferredEducationOptions.includes(
        education
      )
    ) {
      return;
    }

    if (
      this.preferredEducation.includes(education)
    ) {

      this.preferredEducation =
        this.preferredEducation.filter(
          item => item !== education
        );

    } else {

      this.preferredEducation.push(
        education
      );

    }

    // Keep only specific qualifications
    // belonging to currently selected education groups

    const validSpecificOptions =
      this.getEducationSpecificOptions();

    this.preferredEducationSpecific =
      this.preferredEducationSpecific.filter(
        item =>
          validSpecificOptions.includes(item)
      );

  }
  togglePreferredEducationSpecific(
    option: string
  ): void {

    const validOptions =
      this.getEducationSpecificOptions();

    // Only allow currently available qualifications
    if (!validOptions.includes(option)) {
      return;
    }

    const index =
      this.preferredEducationSpecific.indexOf(option);

    if (index === -1) {

      this.preferredEducationSpecific.push(option);

    } else {

      this.preferredEducationSpecific.splice(
        index,
        1
      );

    }

  }
  togglePreferredCareerSector(
    sector: string
  ): void {

    // Only allow predefined career values
    if (
      !this.preferredCareerSectorOptions.includes(
        sector
      )
    ) {
      return;
    }


    // Any selected
    if (sector === 'Any') {

      if (
        this.preferredCareerSectors.includes('Any')
      ) {

        this.preferredCareerSectors = [];

      } else {

        this.preferredCareerSectors = ['Any'];

      }

      return;
    }


    // Remove Any when selecting specific sectors


    this.preferredCareerSectors =
      this.preferredCareerSectors.filter(
        item => item !== 'Any'
      );


    if (
      this.preferredCareerSectors.includes(sector)
    ) {

      this.preferredCareerSectors =
        this.preferredCareerSectors.filter(
          item => item !== sector
        );

    } else {

      this.preferredCareerSectors.push(sector);

    }

  }
  savePreferencesDraft(): void {
    const existing = sessionStorage.getItem(
      'mwi_registration_draft'
    );

    const draft = existing
      ? JSON.parse(existing)
      : {};

    draft.preferences = {
      ageMin: this.preferredAgeMin,
      ageMax: this.preferredAgeMax,

      heightMin: this.preferredHeightMin,
      heightMax: this.preferredHeightMax,

      maritalStatuses: [
        ...this.preferredMaritalStatuses
      ],

      acceptanceOfKids:
        this.acceptanceOfKids,

      religion:
        this.preferredReligion,

      preferredSects: [
        ...this.preferredSects
      ],

      preferredSunniGroups: [
        ...this.preferredSunniGroups
      ],

      preferredSalafiGroups: [
        ...this.preferredSalafiGroups
      ],

      preferredCastes: [
        ...this.preferredCastes
      ],

      preferredSubCastes: [
        ...this.preferredSubCastes
      ],

      preferredEducation: [
        ...this.preferredEducation
      ],

      preferredEducationSpecific: [
        ...this.preferredEducationSpecific
      ],

      preferredCareerSectors: [
        ...this.preferredCareerSectors
      ],

      preferredLocations: [
        ...this.preferredLocations
      ]
    };

    sessionStorage.setItem(
      'mwi_registration_draft',
      JSON.stringify(draft)
    );
  }
  // =========================
  // COMPLETE REGISTRATION
  // =========================
  goBack(): void {

    this.errorMessage = '';

    switch (this.step) {

      case 'location':
        this.step = 'basic';
        break;

      case 'religion':
        this.step = 'location';
        break;

      case 'education':
        this.step = 'religion';
        break;

      case 'preferences':
        this.step = 'education';
        break;

      default:
        return;
    }

    this.cdr.detectChanges();
  }
  completeRegistration(): void {

    this.errorMessage = '';

    // AGE
    if (
      Number(this.preferredAgeMin) >
      Number(this.preferredAgeMax)
    ) {

      this.errorMessage =
        'Minimum age cannot be greater than maximum age.';

      return;
    }

    // =========================
    // AGE
    // =========================

    if (
      !this.preferredAgeMin ||
      !this.preferredAgeMax
    ) {

      this.errorMessage =
        'Please select preferred age range.';

      return;
    }


    const minAge =
      Number(this.preferredAgeMin);

    const maxAge =
      Number(this.preferredAgeMax);


    if (
      !Number.isInteger(minAge) ||
      !Number.isInteger(maxAge)
    ) {

      this.errorMessage =
        'Invalid preferred age range.';

      return;
    }


    if (
      minAge < 18 ||
      maxAge > 60 ||
      minAge > maxAge
    ) {

      this.errorMessage =
        'Invalid preferred age range.';

      return;
    }


    // =========================
    // HEIGHT
    // =========================

    if (
      !this.preferredHeightMin ||
      !this.preferredHeightMax
    ) {

      this.errorMessage =
        'Please select preferred height range.';

      return;
    }


    const minHeight =
      Number(this.preferredHeightMin);

    const maxHeight =
      Number(this.preferredHeightMax);


    const allowedHeights =
      this.heightOptions.map(
        height => height.totalInches
      );


    if (
      !allowedHeights.includes(minHeight) ||
      !allowedHeights.includes(maxHeight)
    ) {

      this.errorMessage =
        'Invalid preferred height range.';

      return;
    }


    if (minHeight > maxHeight) {

      this.errorMessage =
        'Minimum height cannot be greater than maximum height.';

      return;
    }





    // MARITAL STATUS
    const allowedMaritalStatuses =
      this.maritalStatusOptions.map(
        item => item.value
      );


    const invalidMaritalStatus =
      this.preferredMaritalStatuses.some(
        status =>
          !allowedMaritalStatuses.includes(status)
      );


    if (invalidMaritalStatus) {

      this.errorMessage =
        'Invalid marital status preference.';

      return;
    }
    if (
      this.preferredMaritalStatuses.length === 0
    ) {

      this.errorMessage =
        'Please select at least one marital status.';

      return;
    }


    // KIDS ACCEPTANCE
    if (
      this.showKidsAcceptance &&
      !this.acceptanceOfKids
    ) {

      this.errorMessage =
        'Please select acceptance of kids.';

      return;
    }


    // RELIGION 

    if (!this.preferredReligion) {

      this.errorMessage =
        'Religion preference is required.';

      return;
    }


    // User cannot change preferred religion

    if (
      this.preferredReligion !== this.religion
    ) {

      this.errorMessage =
        'Religion preference cannot be changed.';

      return;
    }
    // =========================
    // COMMUNITY VALIDATION
    // =========================

    // =========================
    // PREFERENCE COMMUNITY VALIDATION
    // =========================

    if (this.religion === 'Muslim') {

      // -------------------------
      // Preferred Sect
      // -------------------------

      const invalidPreferredSect =
        this.preferredSects.some(
          sect =>
            !this.preferredMuslimSectOptions.includes(sect)
        );

      if (invalidPreferredSect) {

        this.errorMessage =
          'Invalid preferred Muslim sect selected.';

        return;
      }


      // -------------------------
      // Sunni
      // -------------------------

      if (
        this.preferredSects.includes('Sunni')
      ) {

        const invalidSunniGroup =
          this.preferredSunniGroups.some(
            group =>
              !this.preferredSunniGroupOptions.includes(group)
          );

        if (invalidSunniGroup) {

          this.errorMessage =
            'Invalid preferred Sunni group selected.';

          return;
        }
      }


      // -------------------------
      // Salafi
      // -------------------------

      if (
        this.preferredSects.includes('Salafi')
      ) {

        const invalidSalafiGroup =
          this.preferredSalafiGroups.some(
            group =>
              !this.preferredSalafiGroupOptions.includes(group)
          );

        if (invalidSalafiGroup) {

          this.errorMessage =
            'Invalid preferred Salafi group selected.';

          return;
        }
      }

    }


    if (this.religion === 'Hindu') {

      // -------------------------
      // Preferred Caste
      // -------------------------

      const invalidPreferredCaste =
        this.preferredCastes.some(
          caste =>
            !this.preferredHinduCasteOptions.includes(caste)
        );

      if (invalidPreferredCaste) {

        this.errorMessage =
          'Invalid preferred caste selected.';

        return;
      }


      // -------------------------
      // Preferred Sub-caste
      // -------------------------

      for (
        const subCaste
        of this.preferredSubCastes
      ) {

        const isValidSubCaste =
          this.preferredCastes.some(
            caste => {

              const allowedSubCastes =
                this.getHinduSubCastesForCaste(
                  caste
                );

              return subCaste === 'Any' || allowedSubCastes.includes(
                subCaste
              );

            }
          );


        if (!isValidSubCaste) {

          this.errorMessage =
            'Invalid preferred sub-caste selected.';

          return;
        }

      }

    }


    if (this.religion === 'Christian') {

      // -------------------------
      // Preferred Denomination
      // -------------------------

      const invalidDenomination =
        this.preferredSects.some(
          denomination =>
            !this.preferredChristianDenominationOptions.includes(
              denomination
            )
        );

      if (invalidDenomination) {

        this.errorMessage =
          'Invalid preferred denomination selected.';

        return;
      }


      // -------------------------
      // Preferred Sub-denomination
      // -------------------------

      for (
        const subDenomination
        of this.preferredSubCastes
      ) {

        const isValidSubDenomination =
          this.preferredSects.some(
            denomination => {

              const allowed =
                this.christianOptions[
                denomination
                ] || [];

              return subDenomination === 'Any' || allowed.includes(
                subDenomination
              );

            }
          );


        if (!isValidSubDenomination) {

          this.errorMessage =
            'Invalid preferred sub-denomination selected.';

          return;
        }

      }

    }

    // LOCATION
    if (
      this.preferredLocations.length === 0
    ) {

      this.errorMessage =
        'Please select at least one preferred location.';

      return;
    }

    // =========================
    // WHITELIST VALIDATION
    // =========================

    // EDUCATION

    const invalidEducation =
      this.preferredEducation.some(
        education =>
          !this.preferredEducationOptions.includes(
            education
          )
      );

    if (invalidEducation) {

      this.errorMessage =
        'Invalid education preference selected.';

      return;
    }
    const validSpecificEducationOptions =
      this.getEducationSpecificOptions();

    const invalidSpecificEducation =
      this.preferredEducationSpecific.some(
        qualification =>
          !validSpecificEducationOptions.includes(
            qualification
          )
      );

    if (invalidSpecificEducation) {

      this.errorMessage =
        'Invalid specific education preference selected.';

      return;
    }

    // CAREER

    const invalidCareer =
      this.preferredCareerSectors.some(
        sector =>
          !this.preferredCareerSectorOptions.includes(
            sector
          )
      );

    if (invalidCareer) {

      this.errorMessage =
        'Invalid career preference selected.';

      return;
    }


    // LOCATION

    const invalidLocation =
      this.preferredLocations.some(
        location =>
          location !== 'All Kerala' &&
          !this.districts.includes(location)
      );

    if (invalidLocation) {

      this.errorMessage =
        'Invalid preferred location selected.';

      return;
    }


    // =========================
    // SAVE PREFERENCES TO DB
    // =========================

    const preferencesData = {
      ageMin: this.preferredAgeMin,
      ageMax: this.preferredAgeMax,

      heightMin: this.preferredHeightMin,
      heightMax: this.preferredHeightMax,

      maritalStatuses: [...this.preferredMaritalStatuses],

      acceptanceOfKids: this.acceptanceOfKids,

      religion: this.preferredReligion,

      preferredSects: [...this.preferredSects],
      preferredSunniGroups: [...this.preferredSunniGroups],
      preferredSalafiGroups: [...this.preferredSalafiGroups],

      preferredCastes: [...this.preferredCastes],
      preferredSubCastes: [...this.preferredSubCastes],

      preferredEducation: [...this.preferredEducation],
      preferredEducationSpecific: [...this.preferredEducationSpecific],

      preferredCareerSectors: [...this.preferredCareerSectors],

      preferredLocations: [...this.preferredLocations]
    };

    this.loading = true;
    this.errorMessage = '';

    this.apiService.savePreferences(preferencesData).subscribe({
      next: (prefResponse: any) => {

        if (prefResponse?.success !== true) {

          this.loading = false;

          this.errorMessage =
            prefResponse?.message || 'Unable to save preferences.';

          this.cdr.detectChanges();

          return;
        }




        // Preferences saved to DB — persist locally too, then finalize
        this.savePreferencesDraft();

        // =========================
        // COMPLETE REGISTRATION
        // =========================

        this.apiService.completeRegistration().subscribe({
          next: (response: any) => {

            console.log(
              'Complete Registration API Response:',
              response
            );

            this.loading = false;

            if (response?.success === true) {

              sessionStorage.removeItem(
                'mwi_registration_draft'
              );

              this.step = 'success';

              this.cdr.detectChanges();

              return;
            }

            this.errorMessage =
              response?.message ||
              'Unable to complete registration.';

            this.cdr.detectChanges();
          },

          error: (error: any) => {

            console.error(
              'Complete Registration API Error:',
              error
            );

            this.loading = false;

            this.errorMessage =
              error?.error?.message ||
              'Unable to complete registration.';

            this.cdr.detectChanges();
          }
        });
      },

      error: (error: any) => {

        console.error('Preferences save error:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to save preferences.';

        this.cdr.detectChanges();
      }
    });














  }
  setDefaultCommunityPreferences(): void {

    // Run only once
    if (this.communityPreferenceDefaultsInitialized) {
      return;
    }


    // =========================
    // MUSLIM
    // =========================

    if (this.religion === 'Muslim') {

      // Registered sect → default preferred sect

      if (
        this.muslimSect &&
        this.muslimSects.includes(this.muslimSect)
      ) {

        this.preferredSects = [
          this.muslimSect
        ];

      }


      // Registered Sunni group → default preference

      if (
        this.muslimSect === 'Sunni' &&
        this.sunniGroup &&
        this.sunniGroups.includes(this.sunniGroup)
      ) {

        this.preferredSunniGroups = [
          this.sunniGroup
        ];

      }


      // Registered Salafi group → default preference

      if (
        this.muslimSect === 'Salafi' &&
        this.salafiGroup &&
        this.salafiGroups.includes(this.salafiGroup)
      ) {

        this.preferredSalafiGroups = [
          this.salafiGroup
        ];

      }

    }


    // =========================
    // HINDU
    // =========================

    if (this.religion === 'Hindu') {

      // Registered caste → default preferred caste

      if (
        this.hinduCaste &&
        this.hinduCastes.includes(this.hinduCaste)
      ) {

        this.preferredCastes = [
          this.hinduCaste
        ];

      }


      // Registered sub-caste → default preference

      if (
        this.hinduSubCaste &&
        this.getHinduSubCastesForCaste(
          this.hinduCaste
        ).includes(this.hinduSubCaste)
      ) {

        this.preferredSubCastes = [
          this.hinduSubCaste
        ];

      }

    }


    // =========================
    // CHRISTIAN
    // =========================

    if (this.religion === 'Christian') {

      // Registered denomination → default preferred denomination

      if (
        this.christianDenomination &&
        this.christianDenominations.includes(
          this.christianDenomination
        )
      ) {

        // Existing model uses preferredSects
        // for Christian denomination preference

        this.preferredSects = [
          this.christianDenomination
        ];

      }


      // Registered sub-denomination → default preference

      if (
        this.christianSubDenomination &&
        this.christianOptions[
          this.christianDenomination
        ]?.includes(
          this.christianSubDenomination
        )
      ) {

        // Existing model uses preferredSubCastes
        // for Christian sub-denomination preference

        this.preferredSubCastes = [
          this.christianSubDenomination
        ];

      }

    }


    this.communityPreferenceDefaultsInitialized = true;

  }
  goToHome(): void {

    this.router.navigate(['/user-home']);

  }
  goToDbCheck(): void {
    this.router.navigate([
      '/registration-db-check'
    ]);
  }



}