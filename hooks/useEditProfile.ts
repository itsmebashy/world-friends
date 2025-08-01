import { useState, useMemo, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import {
  EditProfileData,
  editProfileSchema,
  validateEditStep,
} from "@/validations/profile";
import { EditBasicInfo } from "@/components/profile-management/EditBasicInfo";
import { LanguagesCountry } from "@/components/profile-management/LanguagesCountry";
import { AboutMe } from "@/components/profile-management/AboutMe";
import { TravelInterests } from "@/components/profile-management/TravelInterests";
import { Finalize } from "@/components/profile-management/Finalize";
import { LoadingModal } from "@/components/common/LoadingModal";
import { api } from "@/convex/_generated/api";
import { uploadImage } from "@/utils/uploadImages";

const STEPS = [
  { id: 1, title: "Basic Info", component: EditBasicInfo },
  { id: 2, title: "Languages & Country", component: LanguagesCountry },
  { id: 3, title: "About Me", component: AboutMe },
  { id: 4, title: "Travel Interests", component: TravelInterests },
  { id: 5, title: "Finalize", component: Finalize },
];

export const useEditProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get current profile data
  const profileData = useQuery(api.profiles.getCurrentProfile);

  // Convex mutations
  const updateProfile = useMutation(api.profiles.updateProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
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

  // Update form when profile data loads
  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name,
        country: profileData.countryCode,
        languagesSpoken: profileData.spokenLanguagesCodes,
        languagesLearning: profileData.learningLanguagesCodes,
        bio: profileData.aboutMe,
        hobbies: profileData.hobbies,
        favoriteBooks: profileData.favoriteBooks,
        countriesTraveled: profileData.visitedCountryCodes,
        countriesWantToTravel: profileData.wantToVisitCountryCodes,
        profilePicture: profileData.profilePictureUrl || "",
        genderPreference: profileData.genderPreference,
      });
    }
  }, [profileData, reset]);

  const currentStepData = useMemo(
    () => STEPS.find((step) => step.id === currentStep),
    [currentStep]
  );

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === STEPS.length;

  const validateCurrentStep = async () => {
    const currentData = getValues();
    const validation = validateEditStep(currentStep, currentData);

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: firstError.message,
        position: "top",
      });
      return false;
    }
    return true;
  };

  const onSubmit = handleSubmit(async (data: EditProfileData) => {
    try {
      setIsUpdating(true);

      if (!profileData) {
        throw new Error("Profile data not loaded");
      }

      // Handle profile picture upload if changed
      let profilePictureId = profileData.profilePicture;

      if (
        data.profilePicture &&
        data.profilePicture !== profileData.profilePictureUrl
      ) {
        const uploadResult = await uploadImage(
          data.profilePicture,
          generateUploadUrl
        );
        if (!uploadResult) {
          throw new Error("Failed to upload profile picture");
        }
        profilePictureId = uploadResult.storageId as any;
      }

      // Update profile
      await updateProfile({
        name: data.name,
        countryCode: data.country,
        spokenLanguagesCodes: data.languagesSpoken || [],
        learningLanguagesCodes: data.languagesLearning || [],
        aboutMe: data.bio,
        hobbies: data.hobbies || [],
        visitedCountryCodes: data.countriesTraveled || [],
        wantToVisitCountryCodes: data.countriesWantToTravel || [],
        favoriteBooks: data.favoriteBooks || [],
        genderPreference: data.genderPreference,
        profilePicture: profilePictureId,
      });

      Toast.show({
        type: "success",
        text1: "Profile Updated!",
        text2: "Your profile has been updated successfully.",
        position: "top",
      });

      // Navigate back
      router.back();
    } catch (error) {
      console.error("Profile update failed:", error);
      Toast.show({
        type: "error",
        text1: "Profile Update Failed",
        text2: error instanceof Error ? error.message : "Please try again.",
        position: "top",
      });
    } finally {
      setIsUpdating(false);
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
      router.back();
    }
    setCurrentStep((prev) => prev - 1);
    // Scroll to top when moving to previous step
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
  };

  const getButtonText = () => {
    if (isLastStep) return "Update Profile";
    return "Continue";
  };

  const progressPercentage = (currentStep / STEPS.length) * 100;

  return {
    // State
    currentStep,
    scrollViewRef,
    isUpdating,
    profileData,

    // Form
    control,
    errors,

    // Computed values
    currentStepData,
    isFirstStep,
    isLastStep,
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
