import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Profile } from '../../models/profile.model'
import { ApiService } from '../../services/api'
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

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
        this.churchName || undefined,


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
  churchName = '';

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
  preferredDenomination: string[] = [];

  preferredLocations: string[] = [];

  preferredLocationInput = '';

  preferredEducation: string[] = [];

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
    private cdr: ChangeDetectorRef,
    private apiService: ApiService,
    private http: HttpClient
  ) { }


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

    this.apiService.checkPhone({
      phone: phone
    }).subscribe({

      next: (response) => {

        this.loading = false;

        if (response.status === 'exists') {

          this.errorMessage =
            'You are already registered with us. Please login to continue.';

          this.cdr.detectChanges();


          return;
        }

        if (response.status === 'new') {

          this.errorMessage = '';

          this.successMessage =
            'OTP sent successfully.';

          this.step = 'otp';

          this.cdr.detectChanges();

          return;
        }

        this.errorMessage =
          'Unexpected server response.';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('API Error:', error);

        this.loading = false;

        this.errorMessage =
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      },

      complete: () => {

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }


  // =========================
  // OTP VERIFY
  // =========================

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
      otp: otp
    }).subscribe({

      next: (response) => {

        console.log(
          'OTP PHP Response:',
          response
        );

        this.loading = false;

        if (response.success === true) {

          this.memberId =
            response.member_id;

          this.errorMessage = '';

          this.successMessage = '';

          // Go to Basic Details
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
          'OTP API Error:',
          error
        );

        this.loading = false;

        this.errorMessage =
          'Unable to connect to the server. Please try again.';

        this.cdr.detectChanges();
      },

      complete: () => {

        this.loading = false;

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

    this.step = 'basic';

    this.cdr.detectChanges();
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


    /*
     * Temporary:
     * Location step will be implemented next.
     */

    this.step = 'location';

    this.cdr.detectChanges();
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
            'Unable to determine your address from the current location.'
          );

          return;
        }


        // =========================
        // STATE
        // =========================

        this.state =
          address.state ||
          'Kerala';


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

    this.showLocationModal = false;

    this.showLocationDetails = true;

    this.locationError = message;

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

    this.cdr.detectChanges();

    setTimeout(() => {
      this.initializeMap();
    }, 100);

  }
  private initializeMap(): void {

    if (this.map) {

      this.map.remove();

      this.map = null;

    }


    this.map = L.map('register-map', {
      zoomControl: true
    }).setView(
      [10.8505, 76.2711],
      8
    );


    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    ).addTo(this.map);


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

    }


    // Add new marker

    this.mapMarker = L.marker([
      latitude,
      longitude
    ]).addTo(this.map!);


    this.mapMarker
      .bindPopup(
        'Selected Location'
      )
      .openPopup();


    console.log(
      'Selected map location:',
      latitude,
      longitude
    );


    this.reverseGeocode(
      latitude,
      longitude
    );

  }
  cancelMap(): void {

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


    this.showLocationModal = false;

    this.showLocationDetails = true;

    this.locationMethod = 'map';

    this.locationError = '';

    this.cdr.detectChanges();

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

    if (!this.place.trim()) {

      this.locationError =
        'Please enter place.';

      return;
    }

    // District must be from allowed list

    if (!this.districts.includes(this.district)) {

      this.locationError =
        'Please select a valid district.';

      return;
    }

    this.step = 'religion';

    this.cdr.detectChanges();
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


    this.step = 'education';

    this.cdr.detectChanges();
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


    // Religion is always linked to registered religion

    this.preferredReligion =
      this.religion;


    this.step = 'preferences';

    this.cdr.detectChanges();

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

    if (!search) {
      return this.districts.filter(
        district =>
          !this.preferredLocations.includes(district)
      );
    }

    return this.districts.filter(
      district =>
        district.toLowerCase().includes(search) &&
        !this.preferredLocations.includes(district)
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

      return this.muslimSects;

    }

    if (this.religion === 'Hindu') {

      return this.hinduCastes;

    }

    if (this.religion === 'Christian') {

      return this.christianDenominations;

    }

    return [];
  }
  getPreferredSubCastes(): string[] {

    if (
      this.religion !== 'Hindu' ||
      this.preferredCastes.length === 0
    ) {

      return [];

    }

    const subCastes = new Set<string>();

    for (
      const caste of this.preferredCastes
    ) {

      if (caste === 'Nair') {

        this.nairSubCastes.forEach(
          item => subCastes.add(item)
        );

      }

      if (caste === 'Viswakarma') {

        this.viswakarmaSubCastes.forEach(
          item => subCastes.add(item)
        );

      }

      if (caste === 'SC') {

        this.scSubCastes.forEach(
          item => subCastes.add(item)
        );

      }

      if (caste === 'ST') {

        this.stSubCastes.forEach(
          item => subCastes.add(item)
        );

      }

    }

    return Array.from(subCastes);
  }
  togglePreferredCommunity(
    value: string
  ): void {

    const index =
      this.preferredSects.indexOf(value);

    if (index >= 0) {

      this.preferredSects.splice(index, 1);

    } else {

      this.preferredSects.push(value);

    }

  }

  togglePreferredSect(
    sect: string
  ): void {

    if (!this.muslimSects.includes(sect)) {
      return;
    }

    if (this.preferredSects.includes(sect)) {

      this.preferredSects =
        this.preferredSects.filter(
          item => item !== sect
        );

      // Parent removed → clear child selections
      if (sect === 'Sunni') {
        this.preferredSunniGroups = [];
      }

      if (sect === 'Salafi') {
        this.preferredSalafiGroups = [];
      }

    } else {

      this.preferredSects.push(sect);

    }
  }

  togglePreferredSunniGroup(
    group: string
  ): void {

    if (!this.sunniGroups.includes(group)) {
      return;
    }

    if (
      this.preferredSunniGroups.includes(group)
    ) {

      this.preferredSunniGroups =
        this.preferredSunniGroups.filter(
          item => item !== group
        );

    } else {

      this.preferredSunniGroups.push(group);

    }
  }
  togglePreferredSalafiGroup(
    group: string
  ): void {

    if (!this.salafiGroups.includes(group)) {
      return;
    }

    if (
      this.preferredSalafiGroups.includes(group)
    ) {

      this.preferredSalafiGroups =
        this.preferredSalafiGroups.filter(
          item => item !== group
        );

    } else {

      this.preferredSalafiGroups.push(group);

    }
  }
  togglePreferredCaste(
    caste: string
  ): void {

    if (!this.hinduCastes.includes(caste)) {
      return;
    }

    if (this.preferredCastes.includes(caste)) {

      this.preferredCastes =
        this.preferredCastes.filter(
          item => item !== caste
        );

      // Remove child selections belonging
      // to this caste

      const allowedForRemaining =
        this.preferredCastes.flatMap(
          item =>
            this.getHinduSubCastesForCaste(item)
        );

      this.preferredSubCastes =
        this.preferredSubCastes.filter(
          sub =>
            allowedForRemaining.includes(sub)
        );

    } else {

      this.preferredCastes.push(caste);

    }
  }
  togglePreferredSubCaste(
    subCaste: string
  ): void {

    const allowedSubCastes =
      this.preferredCastes.flatMap(
        caste =>
          this.getHinduSubCastesForCaste(caste)
      );

    if (!allowedSubCastes.includes(subCaste)) {
      return;
    }

    if (
      this.preferredSubCastes.includes(subCaste)
    ) {

      this.preferredSubCastes =
        this.preferredSubCastes.filter(
          item => item !== subCaste
        );

    } else {

      this.preferredSubCastes.push(
        subCaste
      );

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

    if (
      !this.christianDenominations.includes(
        denomination
      )
    ) {
      return;
    }

    if (
      this.preferredSects.includes(denomination)
    ) {

      this.preferredSects =
        this.preferredSects.filter(
          item => item !== denomination
        );

      const allowed =
        this.preferredSects.flatMap(
          item =>
            this.christianOptions[item] || []
        );

      this.preferredSubCastes =
        this.preferredSubCastes.filter(
          item => allowed.includes(item)
        );

    } else {

      this.preferredSects.push(
        denomination
      );

    }
  }
  togglePreferredSubDenomination(
    subDenomination: string
  ): void {

    const allowed =
      this.preferredSects.flatMap(
        denomination =>
          this.christianOptions[
          denomination
          ] || []
      );

    if (!allowed.includes(subDenomination)) {
      return;
    }

    if (
      this.preferredSubCastes.includes(
        subDenomination
      )
    ) {

      this.preferredSubCastes =
        this.preferredSubCastes.filter(
          item =>
            item !== subDenomination
        );

    } else {

      this.preferredSubCastes.push(
        subDenomination
      );

    }
  }
  togglePreferredEducation(
    education: string
  ): void {

    // Only allow predefined education values
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
            !this.muslimSects.includes(sect)
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
              !this.sunniGroups.includes(group)
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
              !this.salafiGroups.includes(group)
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
            !this.hinduCastes.includes(caste)
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

              return allowedSubCastes.includes(
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
            !this.christianDenominations.includes(
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

              return allowed.includes(
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
          !this.districts.includes(location)
      );

    if (invalidLocation) {

      this.errorMessage =
        'Invalid preferred location selected.';

      return;
    }


    console.log(
      'REGISTRATION READY:',
      {
        memberId: this.memberId,
        phone: this.phone,

        ageMin:
          this.preferredAgeMin,

        ageMax:
          this.preferredAgeMax,

        heightMin:
          this.preferredHeightMin,

        heightMax:
          this.preferredHeightMax,

        maritalStatuses:
          this.preferredMaritalStatuses,

        acceptanceOfKids:
          this.acceptanceOfKids,

        religion:
          this.preferredReligion,

        preferredSects:
          this.preferredSects,

        preferredCastes:
          this.preferredCastes,

        preferredSubCastes:
          this.preferredSubCastes,

        preferredLocations:
          this.preferredLocations,

        preferredEducation:
          this.preferredEducation,

        preferredCareerSectors:
          this.preferredCareerSectors,
      }
    );


    // TEMPORARY
    // Database save will come later.
    const profile = this.buildProfile();

    sessionStorage.setItem(
      'mwi_registration',
      JSON.stringify(profile)
    );


    this.step = 'success';

    this.cdr.detectChanges();



  }
  goToHome(): void {

    this.router.navigate(['/user-home']);

  }




}