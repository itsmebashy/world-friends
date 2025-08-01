import { useState, useMemo, useRef } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  ProfileCreationData,
  profileCreationSchema,
  validateStep,
} from "@/validations/profile";
import { BasicInfo } from "@/components/profile-management/BasicInfo";
import { LanguagesCountry } from "@/components/profile-management/LanguagesCountry";
import { AboutMe } from "@/components/profile-management/AboutMe";
import { TravelInterests } from "@/components/profile-management/TravelInterests";
import { Finalize } from "@/components/profile-management/Finalize";
import { LoadingModal } from "@/components/common/LoadingModal";
import { api } from "@/convex/_generated/api";
import { uploadImage } from "@/utils/uploadImages";

const STEPS = [
  { id: 1, title: "Basic Info", component: BasicInfo },
  { id: 2, title: "Languages & Country", component: LanguagesCountry },
  { id: 3, title: "About Me", component: AboutMe },
  { id: 4, title: "Travel Interests", component: TravelInterests },
  { id: 5, title: "Finalize", component: Finalize },
];

export const useCreateProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Convex mutations
  const createProfile = useMutation(api.profiles.createProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ProfileCreationData>({
    resolver: zodResolver(profileCreationSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      username: "",
      gender: undefined as any,
      birthdate: undefined as any,
      country: "",
      languagesSpoken: [],
      languagesLearning: [],
      bio: "",
      hobbies: [],
      favoriteBooks: [],
      countriesTraveled: [],
      countriesWantToTravel: [],
      profilePicture: "",
      genderPreference: false,
    },
  });

  const currentStepData = useMemo(
    () => STEPS.find((step) => step.id === currentStep),
    [currentStep]
  );

  const isLastStep = currentStep === STEPS.length;
  const isFirstStep = currentStep === 1;

  const validateCurrentStep = async () => {
    const currentData = getValues();
    const validation = validateStep(currentStep, currentData);

    if (!validation.success) {
      // Don't show toast here, let the inline validation handle it
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data: ProfileCreationData) => {
    try {
      setIsCreating(true);

      // Upload profile picture first
      let profilePictureId = "";

      if (data.profilePicture) {
        const uploadResult = await uploadImage(
          data.profilePicture,
          generateUploadUrl
        );
        if (!uploadResult) {
          throw new Error("Failed to upload profile picture");
        }
        profilePictureId = uploadResult.storageId;
      }

      // Create profile
      await createProfile({
        name: data.name,
        userName: data.username,
        profilePicture: profilePictureId as any,
        gender: data.gender as "male" | "female" | "other",
        birthDate: data.birthdate.toISOString(),
        countryCode: data.country,
        spokenLanguagesCodes: data.languagesSpoken || [],
        learningLanguagesCodes: data.languagesLearning || [],
        aboutMe: data.bio,
        hobbies: data.hobbies || [],
        visitedCountryCodes: data.countriesTraveled || [],
        wantToVisitCountryCodes: data.countriesWantToTravel || [],
        favoriteBooks: data.favoriteBooks || [],
        genderPreference: data.genderPreference,
      });

      Toast.show({
        type: "success",
        text1: "Profile Created!",
        text2: "Your profile has been created successfully.",
        position: "top",
      });

      // Navigate to home screen
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Profile creation failed:", error);
      Toast.show({
        type: "error",
        text1: "Profile Creation Failed",
        text2: error instanceof Error ? error.message : "Please try again.",
        position: "top",
      });
    } finally {
      setIsCreating(false);
    }
  });

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (!isStepValid) return;

    if (isLastStep) {
      onSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
      // Scroll to top when moving to next step
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }
  };

  const handleBack = () => {
    if (isFirstStep) {
      // Handle navigation back to previous screen
      return;
    }
    setCurrentStep((prev) => prev - 1);
    // Scroll to top when moving to previous step
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const getButtonText = () => {
    if (isLastStep) return "Create Profile";
    return "Continue";
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return {
    // State
    currentStep,
    scrollViewRef,
    isCreating,

    // Form
    control,
    errors,

    // Computed values
    currentStepData,
    isLastStep,
    isFirstStep,
    progressPercentage,

    // Actions
    handleNext,
    handleBack,
    getButtonText,

    // Constants
    STEPS,

    // Components
    LoadingModal,
  };
};
