import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Heart, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Lock, 
  Copy, 
  Check, 
  ChevronRight, 
  ArrowRight, 
  RefreshCw
} from 'lucide-react';

// Define step types
type Step = 'basics' | 'personality' | 'preferences' | 'experiences' | 'values' | 'review';

// Define basic info type
interface BasicInfo {
  firstName: string;
  lastName: string;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  gender: string;
  nationality: string;
}

// Define personality info type
interface PersonalityInfo {
  personalityType: string;
  traits: string[];
  strengths: string[];
  challenges: string[];
}

// Define preferences info type
interface PreferencesInfo {
  favoriteColor: string;
  favoriteMusic: string[];
  favoriteFood: string;
  favoriteHobby: string;
  favoriteBook: string;
  favoriteMovie: string;
  morningPerson: boolean;
  nightPerson: boolean;
}

// Define experiences info type
interface ExperiencesInfo {
  education: string;
  profession: string;
  livedCountries: string[];
  languages: string[];
}

// Define values info type
interface ValuesInfo {
  coreValues: string[];
  causes: string[];
  lifeGoal: string;
  legacy: string;
}

function App() {
  // Current step state
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  
  // Basic info state
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    gender: '',
    nationality: '',
  });
  
  // Personality info state
  const [personalityInfo, setPersonalityInfo] = useState<PersonalityInfo>({
    personalityType: '',
    traits: [],
    strengths: [],
    challenges: [],
  });
  
  // Preferences info state
  const [preferencesInfo, setPreferencesInfo] = useState<PreferencesInfo>({
    favoriteColor: '',
    favoriteMusic: [],
    favoriteFood: '',
    favoriteHobby: '',
    favoriteBook: '',
    favoriteMovie: '',
    morningPerson: false,
    nightPerson: false,
  });
  
  // Experiences info state
  const [experiencesInfo, setExperiencesInfo] = useState<ExperiencesInfo>({
    education: '',
    profession: '',
    livedCountries: [''],
    languages: [],
  });
  
  // Values info state
  const [valuesInfo, setValuesInfo] = useState<ValuesInfo>({
    coreValues: [],
    causes: [],
    lifeGoal: '',
    legacy: '',
  });
  
  // PUID state
  const [puid, setPuid] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Generate PUID when reaching review step
  useEffect(() => {
    if (currentStep === 'review') {
      generatePUID();
    }
  }, [currentStep]);
  
  // Generate PUID based on personal information
  const generatePUID = () => {
    // Extract components from personal info
    const components = [
      basicInfo.firstName.substring(0, 3),
      basicInfo.lastName.substring(0, 3),
      basicInfo.birthYear.substring(2),
      personalityInfo.personalityType.substring(0, 2),
      preferencesInfo.favoriteColor.substring(0, 2),
      experiencesInfo.profession.substring(0, 3),
      valuesInfo.coreValues[0]?.substring(0, 2) || 'va',
    ];
    
    // Shuffle and transform components
    let generatedPUID = '';
    const shuffledComponents = [...components].sort(() => Math.random() - 0.5);
    
    shuffledComponents.forEach(component => {
      // Randomly transform each component
      let transformed = '';
      for (let i = 0; i < component.length; i++) {
        const char = component[i];
        if (Math.random() > 0.5) {
          transformed += char.toUpperCase();
        } else {
          transformed += char.toLowerCase();
        }
      }
      generatedPUID += transformed;
    });
    
    // Add some random numbers and special characters
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const symbols = ['!', '@', '#', '$', '%', '&', '*'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Combine all parts
    generatedPUID = `${generatedPUID}${numbers}${randomSymbol}`;
    
    // Set the generated PUID
    setPuid(generatedPUID);
  };
  
  // Regenerate PUID
  const regeneratePUID = () => {
    generatePUID();
  };
  
  // Copy PUID to clipboard
  const copyPUID = () => {
    navigator.clipboard.writeText(puid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicInfo({
      ...basicInfo,
      [name]: value,
    });
  };
  
  // Handle personality info changes
  const handlePersonalityTypeChange = (type: string) => {
    setPersonalityInfo({
      ...personalityInfo,
      personalityType: type,
    });
  };
  
  const handleTraitToggle = (trait: string) => {
    if (personalityInfo.traits.includes(trait)) {
      setPersonalityInfo({
        ...personalityInfo,
        traits: personalityInfo.traits.filter(t => t !== trait),
      });
    } else if (personalityInfo.traits.length < 5) {
      setPersonalityInfo({
        ...personalityInfo,
        traits: [...personalityInfo.traits, trait],
      });
    }
  };
  
  const handleStrengthToggle = (strength: string) => {
    if (personalityInfo.strengths.includes(strength)) {
      setPersonalityInfo({
        ...personalityInfo,
        strengths: personalityInfo.strengths.filter(s => s !== strength),
      });
    } else if (personalityInfo.strengths.length < 3) {
      setPersonalityInfo({
        ...personalityInfo,
        strengths: [...personalityInfo.strengths, strength],
      });
    }
  };
  
  const handleChallengeToggle = (challenge: string) => {
    if (personalityInfo.challenges.includes(challenge)) {
      setPersonalityInfo({
        ...personalityInfo,
        challenges: personalityInfo.challenges.filter(c => c !== challenge),
      });
    } else if (personalityInfo.challenges.length < 3) {
      setPersonalityInfo({
        ...personalityInfo,
        challenges: [...personalityInfo.challenges, challenge],
      });
    }
  };
  
  // Handle preferences info changes
  const handlePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreferencesInfo({
      ...preferencesInfo,
      [name]: value,
    });
  };
  
  const handleMusicToggle = (genre: string) => {
    if (preferencesInfo.favoriteMusic.includes(genre)) {
      setPreferencesInfo({
        ...preferencesInfo,
        favoriteMusic: preferencesInfo.favoriteMusic.filter(g => g !== genre),
      });
    } else if (preferencesInfo.favoriteMusic.length < 3) {
      setPreferencesInfo({
        ...preferencesInfo,
        favoriteMusic: [...preferencesInfo.favoriteMusic, genre],
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferencesInfo({
      ...preferencesInfo,
      [name]: checked,
    });
  };
  
  // Handle experiences info changes
  const handleExperiencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExperiencesInfo({
      ...experiencesInfo,
      [name]: value,
    });
  };
  
  const handleCountryChange = (index: number, value: string) => {
    const updatedCountries = [...experiencesInfo.livedCountries];
    updatedCountries[index] = value;
    setExperiencesInfo({
      ...experiencesInfo,
      livedCountries: updatedCountries,
    });
  };
  
  const addCountryField = () => {
    setExperiencesInfo({
      ...experiencesInfo,
      livedCountries: [...experiencesInfo.livedCountries, ''],
    });
  };
  
  const removeCountryField = (index: number) => {
    const updatedCountries = [...experiencesInfo.livedCountries];
    updatedCountries.splice(index, 1);
    setExperiencesInfo({
      ...experiencesInfo,
      livedCountries: updatedCountries,
    });
  };
  
  const handleLanguageToggle = (language: string) => {
    if (experiencesInfo.languages.includes(language)) {
      setExperiencesInfo({
        ...experiencesInfo,
        languages: experiencesInfo.languages.filter(l => l !== language),
      });
    } else {
      setExperiencesInfo({
        ...experiencesInfo,
        languages: [...experiencesInfo.languages, language],
      });
    }
  };
  
  // Handle values info changes
  const handleValuesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValuesInfo({
      ...valuesInfo,
      [name]: value,
    });
  };
  
  const handleCoreValueToggle = (value: string) => {
    if (valuesInfo.coreValues.includes(value)) {
      setValuesInfo({
        ...valuesInfo,
        coreValues: valuesInfo.coreValues.filter(v => v !== value),
      });
    } else if (valuesInfo.coreValues.length < 5) {
      setValuesInfo({
        ...valuesInfo,
        coreValues: [...valuesInfo.coreValues, value],
      });
    }
  };
  
  const handleCauseToggle = (cause: string) => {
    if (valuesInfo.causes.includes(cause)) {
      setValuesInfo({
        ...valuesInfo,
        causes: valuesInfo.causes.filter(c => c !== cause),
      });
    } else if (valuesInfo.causes.length < 3) {
      setValuesInfo({
        ...valuesInfo,
        causes: [...valuesInfo.causes, cause],
      });
    }
  };
  
  // Navigation functions
  const nextStep = () => {
    switch (currentStep) {
      case 'basics':
        setCurrentStep('personality');
        break;
      case 'personality':
        setCurrentStep('preferences');
        break;
      case 'preferences':
        setCurrentStep('experiences');
        break;
      case 'experiences':
        setCurrentStep('values');
        break;
      case 'values':
        setCurrentStep('review');
        break;
      default:
        break;
    }
  };
  
  const prevStep = () => {
    switch (currentStep) {
      case 'personality':
        setCurrentStep('basics');
        break;
      case 'preferences':
        setCurrentStep('personality');
        break;
      case 'experiences':
        setCurrentStep('preferences');
        break;
      case 'values':
        setCurrentStep('experiences');
        break;
      case 'review':
        setCurrentStep('values');
        break;
      default:
        break;
    }
  };
  
  // Check if current step is complete
  const isStepComplete = () => {
    switch (currentStep) {
      case 'basics':
        return (
          basicInfo.firstName.trim() !== '' &&
          basicInfo.lastName.trim() !== '' &&
          basicInfo.birthMonth.trim() !== '' &&
          basicInfo.birthDay.trim() !== '' &&
          basicInfo.birthYear.trim() !== '' &&
          basicInfo.gender.trim() !== ''
        );
      case 'personality':
        return (
          personalityInfo.personalityType !== '' &&
          personalityInfo.traits.length > 0 &&
          personalityInfo.strengths.length > 0 &&
          personalityInfo.challenges.length > 0
        );
      case 'preferences':
        return (
          preferencesInfo.favoriteColor.trim() !== '' &&
          preferencesInfo.favoriteMusic.length > 0 &&
          preferencesInfo.favoriteHobby.trim() !== ''
        );
      case 'experiences':
        return (
          experiencesInfo.education.trim() !== '' &&
          experiencesInfo.profession.trim() !== '' &&
          experiencesInfo.languages.length > 0
        );
      case 'values':
        return (
          valuesInfo.coreValues.length > 0 &&
          valuesInfo.lifeGoal.trim() !== ''
        );
      default:
        return false;
    }
  };
  
  // Render progress bar
  const renderProgressBar = () => {
    const steps: Step[] = ['basics', 'personality', 'preferences', 'experiences', 'values', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    const progress = ((currentIndex) / (steps.length - 1)) * 100;
    
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };
  
  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { id: 'basics', label: 'Basics' },
      { id: 'personality', label: 'Personality' },
      { id: 'preferences', label: 'Preferences' },
      { id: 'experiences', label: 'Experiences' },
      { id: 'values', label: 'Values' },
      { id: 'review', label: 'Review' },
    ];
    
    return (
      <div className="hidden md:flex justify-between mb-8">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="flex flex-col items-center"
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                currentStep === step.id
                  ? 'bg-indigo-600 text-white'
                  : steps.indexOf(steps.find(s => s.id === currentStep)!) > index
                    ? 'bg-indigo-200 text-indigo-700'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span 
              className={`text-xs ${
                currentStep === step.id
                  ? 'text-indigo-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  // Render basics form
  const renderBasicsForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <p className="text-gray-600 mb-6">
            Let's start with some basic information about you. This will help create
            a personalized identifier that reflects who you are.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={basicInfo.firstName}
              onChange={handleBasicInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={basicInfo.lastName}
              onChange={handleBasicInfoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth*
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <select
                name="birthMonth"
                value={basicInfo.birthMonth}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Month</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            
            <div>
              <select
                name="birthDay"
                value={basicInfo.birthDay}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day.toString().padStart(2, '0')}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                name="birthYear"
                value={basicInfo.birthYear}
                onChange={handleBasicInfoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Year</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender*
          </label>
          <select
            id="gender"
            name="gender"
            value={basicInfo.gender}
            onChange={handleBasicInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <input
            type="text"
            id="nationality"
            name="nationality"
            value={basicInfo.nationality}
            onChange={handleBasicInfoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your nationality"
          />
        </div>
      </div>
    );
  };
  
  // Render personality form
  const renderPersonalityForm = () => {
    const personalityTypes = [
      { id: 'analytical', label: 'Analytical', description: 'Logical, methodical, detail-oriented' },
      { id: 'creative', label: 'Creative', description: 'Imaginative, artistic, innovative' },
      { id: 'social', label: 'Social', description: 'Outgoing, empathetic, people-oriented' },
      { id: 'practical', label: 'Practical', description: 'Hands-on, realistic, solution-focused' },
    ];
    
    const traits = [
      'Adventurous', 'Ambitious', 'Calm', 'Careful', 'Cheerful', 
      'Curious', 'Determined', 'Energetic', 'Friendly', 'Generous',
      'Honest', 'Humorous', 'Independent', 'Intuitive', 'Kind',
      'Loyal', 'Optimistic', 'Organized', 'Patient', 'Persistent',
      'Reliable', 'Reserved', 'Sensitive', 'Thoughtful', 'Trustworthy'
    ];
    
    const strengths = [
      'Problem solving', 'Communication', 'Leadership', 'Creativity', 'Adaptability',
      'Time management', 'Teamwork', 'Critical thinking', 'Emotional intelligence', 'Technical skills',
      'Decision making', 'Attention to detail', 'Resilience', 'Negotiation', 'Public speaking'
    ];
    
    const challenges = [
      'Public speaking', 'Handling criticism', 'Work-life balance', 'Delegating tasks', 'Making decisions',
      'Setting boundaries', 'Managing stress', 'Staying organized', 'Meeting deadlines', 'Networking',
      'Asking for help', 'Conflict resolution', 'Patience', 'Focus', 'Self-discipline'
    ];
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personality Profile</h2>
          <p className="text-gray-600 mb-6">
            Let's explore your personality traits and characteristics. This helps create
            an identifier that matches your unique personality.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Personality Type*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Which of these best describes your overall personality?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {personalityTypes.map(type => (
              <div 
                key={type.id}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  personalityInfo.personalityType === type.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePersonalityTypeChange(type.id)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={personalityInfo.personalityType === type.id}
                    onChange={() => {}}
                    className="h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <div className="ml-3">
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Key Traits*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 5 traits that best describe you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {traits.map(trait => (
              <div 
                key={trait}
                className={`border rounded-lg p-2 text-center cursor-pointer transition ${
                  personalityInfo.traits.includes(trait) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleTraitToggle(trait)}
              >
                {trait}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {personalityInfo.traits.length}/5
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Strengths*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 3 of your greatest strengths.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {strengths.map(strength => (
              <div 
                key={strength}
                className={`border rounded-lg p-3 text-center cursor-pointer transition ${
                  personalityInfo.strengths.includes(strength) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleStrengthToggle(strength)}
              >
                {strength}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {personalityInfo.strengths.length}/3
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Challenges*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 3 areas you find challenging.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {challenges.map(challenge => (
              <div 
                key={challenge}
                className={`border rounded-lg p-3 text-center cursor-pointer transition ${
                  personalityInfo.challenges.includes(challenge) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleChallengeToggle(challenge)}
              >
                {challenge}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {personalityInfo.challenges.length}/3
          </p>
        </div>
      </div>
    );
  };
  
  // Render preferences form
  const renderPreferencesForm = () => {
    const musicGenres = [
      'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 
      'Electronic', 'Jazz', 'Classical', 'Folk', 'Metal',
      'Indie', 'Blues', 'Reggae', 'Soul', 'Funk'
    ];
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Preferences</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your preferences and tastes. These details add uniqueness
            to your personal identifier.
          </p>
        </div>
        
        <div>
          <label htmlFor="favoriteColor" className="block text-sm font-medium text-gray-700 mb-1">
            Favorite Color*
          </label>
          <input
            type="text"
            id="favoriteColor"
            name="favoriteColor"
            value={preferencesInfo.favoriteColor}
            onChange={handlePreferencesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Blue, Red, Green"
            required
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Favorite Music Genres*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 3 music genres you enjoy most.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {musicGenres.map(genre => (
              <div 
                key={genre}
                className={`border rounded-lg p-2 text-center cursor-pointer transition ${
                  preferencesInfo.favoriteMusic.includes(genre) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleMusicToggle(genre)}
              >
                {genre}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {preferencesInfo.favoriteMusic.length}/3
          </p>
        </div>
        
        <div>
          <label htmlFor="favoriteFood" className="block text-sm font-medium text-gray-700 mb-1">
            Favorite Food
          </label>
          <input
            type="text"
            id="favoriteFood"
            name="favoriteFood"
            value={preferencesInfo.favoriteFood}
            onChange={handlePreferencesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your favorite food"
          />
        </div>
        
        <div>
          <label htmlFor="favoriteHobby" className="block text-sm font-medium text-gray-700 mb-1">
            Favorite Hobby*
          </label>
          <input
            type="text"
            id="favoriteHobby"
            name="favoriteHobby"
            value={preferencesInfo.favoriteHobby}
            onChange={handlePreferencesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your favorite hobby"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="favoriteBook" className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Book
            </label>
            <input
              type="text"
              id="favoriteBook"
              name="favoriteBook"
              value={preferencesInfo.favoriteBook}
              onChange={handlePreferencesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your favorite book"
            />
          </div>
          
          <div>
            <label htmlFor="favoriteMovie" className="block text-sm font-medium text-gray-700 mb-1">
              Favorite Movie
            </label>
            <input
              type="text"
              id="favoriteMovie"
              name="favoriteMovie"
              value={preferencesInfo.favoriteMovie}
              onChange={handlePreferencesChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your favorite movie"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Daily Rhythm</h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you a morning person, night owl, or both?
          </p>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="morningPerson"
                checked={preferencesInfo.morningPerson}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
              />
              <span>Morning Person</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                name="nightPerson"
                checked={preferencesInfo.nightPerson}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-indigo-600 rounded focus:ring-indigo-500 mr-2"
              />
              <span>Night Owl</span>
            </label>
          </div>
        </div>
      </div>
    );
  };
  
  // Render experiences form
  const renderExperiencesForm = () => {
    const languages = [
      'English', 'Spanish', 'French', 'German', 'Chinese', 
      'Japanese', 'Russian', 'Arabic', 'Portuguese', 'Italian',
      'Hindi', 'Korean', 'Dutch', 'Swedish', 'Greek'
    ];
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Life Experiences</h2>
          <p className="text-gray-600 mb-6">
            Share your educational and professional background, as well as your cultural experiences.
          </p>
        </div>
        
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
            Highest Education Level*
          </label>
          <select
            id="education"
            name="education"
            value={experiencesInfo.education}
            onChange={handleExperiencesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="">Select education level</option>
            <option value="High School">High School</option>
            <option value="Associate's Degree">Associate's Degree</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctorate">Doctorate</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-1">
            Profession/Field*
          </label>
          <input
            type="text"
            id="profession"
            name="profession"
            value={experiencesInfo.profession}
            onChange={handleExperiencesChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your profession or field"
            required
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Countries Lived In</h3>
          <p className="text-sm text-gray-500 mb-4">
            List countries where you've lived for a significant period.
          </p>
          {experiencesInfo.livedCountries.map((country, index) => (
            <div key={index} className="flex items-center mb-3">
              <input
                type="text"
                value={country}
                onChange={(e) => handleCountryChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter country name"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeCountryField(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {experiencesInfo.livedCountries.length < 5 && (
            <button
              type="button"
              onClick={addCountryField}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              + Add Another Country
            </button>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Languages*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select languages you speak or understand.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {languages.map(language => (
              <div 
                key={language}
                className={`border rounded-lg p-2 text-center cursor-pointer transition ${
                  experiencesInfo.languages.includes(language) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleLanguageToggle(language)}
              >
                {language}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {experiencesInfo.languages.length}
          </p>
        </div>
      </div>
    );
  };
  
  // Render values form
  const renderValuesForm = () => {
    const coreValues = [
      'Family', 'Friendship', 'Health', 'Freedom', 'Honesty', 
      'Loyalty', 'Respect', 'Responsibility', 'Compassion', 'Creativity',
      'Growth', 'Knowledge', 'Achievement', 'Adventure', 'Balance',
      'Community', 'Fairness', 'Harmony', 'Independence', 'Security'
    ];
    
    const causes = [
      'Environmental Protection', 'Education', 'Healthcare', 'Animal Welfare', 'Human Rights',
      'Poverty Alleviation', 'Equality', 'Arts & Culture', 'Scientific Research', 'Community Development'
    ];
    
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Values</h2>
          <p className="text-gray-600 mb-6">
            Share what matters most to you. Your values are a core part of your identity.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Core Values*</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 5 values that are most important to you.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {coreValues.map(value => (
              <div 
                key={value}
                className={`border rounded-lg p-2 text-center cursor-pointer transition ${
                  valuesInfo.coreValues.includes(value) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleCoreValueToggle(value)}
              >
                {value}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {valuesInfo.coreValues.length}/5
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Causes You Care About</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select up to 3 causes that you're passionate about.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {causes.map(cause => (
              <div 
                key={cause}
                className={`border rounded-lg p-3 text-center cursor-pointer transition ${
                  valuesInfo.causes.includes(cause) 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
                onClick={() => handleCauseToggle(cause)}
              >
                {cause}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Selected: {valuesInfo.causes.length}/3
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Life Goal*</h3>
          <p className="text-sm text-gray-500 mb-4">
            What is one important goal you have in life?
          </p>
          <textarea
            name="lifeGoal"
            value={valuesInfo.lifeGoal}
            onChange={handleValuesChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe an important goal or aspiration..."
          ></textarea>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Legacy</h3>
          <p className="text-sm text-gray-500 mb-4">
            How would you like to be remembered?
          </p>
          <textarea
            name="legacy"
            value={valuesInfo.legacy}
            onChange={handleValuesChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder=" What legacy would you like to leave behind?"
          ></textarea>
        </div>
      </div>
    );
  };
  
  // Render review page
  const renderReview = () => {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Personal Identity</h2>
          <p className="text-gray-600">
            Based on the information you've provided, we've generated your unique Personal User Identifier (PUID).
          </p>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-indigo-800">Your PUID</h3>
            <div className="flex space-x-2">
              <button
                onClick={regeneratePUID}
                className="text-indigo-600 hover:text-indigo-800"
                aria-label="Regenerate PUID"
              >
                <RefreshCw size={18} />
              </button>
              <button
                onClick={copyPUID}
                className="text-indigo-600 hover:text-indigo-800"
                aria-label="Copy PUID"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
          
          <div className="bg-white border border-indigo-300 rounded-lg px-4 py-3 font-mono text-lg break-all">
            {puid}
          </div>
          
          {copied && (
            <div className="mt-2 text-sm text-green-600 flex items-center">
              <Check size={16} className="mr-1" />
              PUID copied to clipboard!
            </div>
          )}
          
          <div className="mt-4 text-sm text-indigo-700 flex items-center">
            <Shield size={16} className="mr-2" />
            <p>
              This identifier is unique to you and reflects your personal characteristics.
              It can be used as a secure, memorable identifier across various platforms.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center">
              <User size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-900">Basic Information</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Name:</span> {basicInfo.firstName} {basicInfo.lastName}
              </div>
              <div>
                <span className="text-gray-500">Date of Birth:</span> {basicInfo.birthMonth}/{basicInfo.birthDay}/{basicInfo.birthYear}
              </div>
              <div>
                <span className="text-gray-500">Gender:</span> {basicInfo.gender}
              </div>
              {basicInfo.nationality && (
                <div>
                  <span className="text-gray-500">Nationality:</span> {basicInfo.nationality}
                </div>
              )}
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center">
              <Heart size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-900">Personality</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Personality Type:</span> {personalityInfo.personalityType.charAt(0).toUpperCase() + personalityInfo.personalityType.slice(1)}
              </div>
              <div>
                <span className="text-gray-500">Key Traits:</span> {personalityInfo.traits.join(', ')}
              </div>
              <div>
                <span className="text-gray-500">Strengths:</span> {personalityInfo.strengths.join(', ')}
              </div>
              <div>
                <span className="text-gray-500">Challenges:</span> {personalityInfo.challenges.join(', ')}
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center">
              <Sparkles size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-900">Preferences</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Favorite Color:</span> {preferencesInfo.favoriteColor}
              </div>
              <div>
                <span className="text-gray-500">Favorite Music:</span> {preferencesInfo.favoriteMusic.join(', ')}
              </div>
              {preferencesInfo.favoriteFood && (
                <div>
                  <span className="text-gray-500">Favorite Food:</span> {preferencesInfo.favoriteFood}
                </div>
              )}
              <div>
                <span className="text-gray-500">Favorite Hobby:</span> {preferencesInfo.favoriteHobby}
              </div>
              {preferencesInfo.favoriteBook && (
                <div>
                  <span className="text-gray-500">Favorite Book:</span> {preferencesInfo.favoriteBook}
                </div>
              )}
              {preferencesInfo.favoriteMovie && (
                <div>
                  <span className="text-gray-500">Favorite Movie:</span> {preferencesInfo.favoriteMovie}
                </div>
              )}
              <div>
                <span className="text-gray-500">Daily Rhythm:</span> {
                  preferencesInfo.morningPerson && preferencesInfo.nightPerson
                    ? 'Flexible (Both Morning & Night)'
                    : preferencesInfo.morningPerson
                      ? 'Morning Person'
                      : preferencesInfo.nightPerson
                        ? 'Night Owl'
                        : 'Not specified'
                }
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center">
              <Briefcase size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-900">Experiences</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Education:</span> {experiencesInfo.education}
              </div>
              <div>
                <span className="text-gray-500">Profession:</span> {experiencesInfo.profession}
              </div>
              {experiencesInfo.livedCountries.length > 0 && (
                <div>
                  <span className="text-gray-500">Countries Lived In:</span> {experiencesInfo.livedCountries.filter(c => c.trim() !== '').join(', ')}
                </div>
              )}
              <div>
                <span className="text-gray-500">Languages:</span> {experiencesInfo.languages.join(', ')}
              </div>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 flex items-center">
              <GraduationCap size={18} className="text-indigo-600 mr-2" />
              <h3 className="font-medium text-gray-900">Values</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="md:col-span-2">
                <span className="text-gray-500">Core Values:</span> {valuesInfo.coreValues.join(', ')}
              </div>
              {valuesInfo.causes.length > 0 && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Causes:</span> {valuesInfo.causes.join(', ')}
                </div>
              )}
              <div className="md:col-span-2">
                <span className="text-gray-500">Life Goal:</span> {valuesInfo.lifeGoal}
              </div>
              {valuesInfo.legacy && (
                <div className="md:col-span-2">
                  <span className="text-gray-500">Legacy:</span> {valuesInfo.legacy}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
          <div className="flex items-start">
            <Lock size={16} className="text-gray-500 mr-2 mt-0.5" />
            <p>
              Your personal information is secure and will not be stored or shared. 
              The PUID generated is for your personal use and does not contain any directly 
              identifiable information.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'basics':
        return renderBasicsForm();
      case 'personality':
        return renderPersonalityForm();
      case 'preferences':
        return renderPreferencesForm();
      case 'experiences':
        return renderExperiencesForm();
      case 'values':
        return renderValuesForm();
      case 'review':
        return renderReview();
      default:
        return null;
    }
  };
  
  // Render navigation buttons
  const renderNavButtons = () => {
    if (currentStep === 'review') {
      return (
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <ArrowRight size={16} className="mr-2 transform rotate-180" />
            Back
          </button>
          
          <button
            onClick={() => setCurrentStep('basics')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            Start Over
          </button>
        </div>
      );
    }
    
    return (
      <div className="flex justify-between mt-8">
        {currentStep !== 'basics' && (
          <button
            onClick={prevStep}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <ArrowRight size={16} className="mr-2 transform rotate-180" />
            Back
          </button>
        )}
        
        <button
          onClick={nextStep}
          disabled={!isStepComplete()}
          className={`px-4 py-2 rounded-md flex items-center ml-auto ${
            isStepComplete()
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === 'values' ? 'Generate PUID' : 'Continue'}
          <ChevronRight size={16} className="ml-2" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white">
            <h1 className="text-2xl font-bold flex items-center justify-center">
              <Shield className="mr-2" />
              Personal Identity Creator
            </h1>
          </div>
          
          <div className="p-6">
            {renderProgressBar()}
            {renderStepIndicators()}
            
            <div className="mt-6">
              {renderStepContent()}
            </div>
            
            {renderNavButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;