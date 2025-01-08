"use client";
import "./ProfilePage.scss";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuthStore from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SectionLoader from "@/components/SectionLoader/SectionLoader";
import { Loader2, UserX } from "lucide-react";
import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { withAuth } from "@/components/withAuth/withAuth";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import UpdatePassword from "@/components/UpdatePassword/UpdatePassword";

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [profileData, setProfileData] = useState(null);
    const [initialProfileData, setInitialProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [isCustomDegree, setIsCustomDegree] = useState(false); // Track if custom degree is selected

    const predefinedDegrees = ["M.D.", "Ph.D.", "M.D. Ph.D.", "M.S."];

    const handleImageUpload = (url) => {
        setProfileData({
            ...profileData,
            photo: url,
        });
    };

    const fetchProfile = async () => {
        if (!user?.userId) return;

        try {
            const response = await fetch(`/api/profile/${user.userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
                setInitialProfileData(data);

                // Check if the degree value is not in predefined degrees
                setIsCustomDegree(
                    data.degree && !predefinedDegrees.includes(data.degree)
                );
            } else {
                console.error("Failed to fetch profile");
                toast.error("Failed to fetch profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error fetching profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user?.userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.userId,
                    ...profileData,
                }),
            });

            if (response.ok) {
                toast.success("Profile updated successfully!");
                setInitialProfileData(profileData);
                setIsEditing(false);
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error updating profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = async () => {
        setIsEditing(false);
        setLoading(true);
        await fetchProfile();
    };

    useEffect(() => {
        if (profileData && initialProfileData) {
            setIsChanged(
                JSON.stringify(profileData) !==
                    JSON.stringify(initialProfileData)
            );
        }
    }, [profileData, initialProfileData]);

    if (loading) {
        return (
            <main className="profile">
                <Navbar />
                <section className="profile__loading">
                    <SectionLoader />
                </section>
                <Footer />
            </main>
        );
    }

    if (!profileData) {
        return (
            <main className="profile">
                <Navbar />
                <section className="profile__content">
                    <h1 className="profile__title">Profile not found</h1>
                </section>
                <Footer />
            </main>
        );
    }

    return (
        <main className="profile">
            <Navbar />
            <section className="profile__content">
                <div className="profile__actions">
                    <h1 className="heading-quaternary w-500">
                        Welcome,{" "}
                        <span className="color-green">{profileData.name}</span>
                    </h1>
                    {!isEditing && (
                        <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Details
                        </Button>
                    )}

                    {isEditing && (
                        <div className="profile__actions__buttons">
                            <Button
                                type="submit"
                                className="btn btn-primary-green"
                                onClick={handleSubmit}
                                disabled={!isChanged || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            <Button
                                type="button"
                                className="btn btn-primary-white"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                <form className="profile__form" onSubmit={handleSubmit}>
                    <div className="profile__form-group">
                        <label htmlFor="photo" className="profile__label">
                            Photo
                        </label>
                        {profileData.photo ? (
                            <div className="profile__photo-container">
                                <Image
                                    src={profileData.photo}
                                    alt="Profile"
                                    className="profile__photo mb-4"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        ) : (
                            <div className="profile__photo-container">
                                <UserX className="w-8 h-8" />
                            </div>
                        )}
                        {isEditing && (
                            <ImageUpload
                                onImageUpload={handleImageUpload}
                                initialImageUrl={profileData.photo}
                                uploadUrl="/api/profile/upload-image"
                                deleteUrl="/api/profile/delete-image"
                                imageType="profile"
                            />
                        )}
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="name" className="profile__label">
                            Name
                        </label>
                        <Input
                            id="name"
                            className="profile__input"
                            placeholder="Enter your full name"
                            value={profileData.name || ""}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    name: e.target.value,
                                })
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="email" className="profile__label">
                            Email
                        </label>
                        <Input
                            type="email"
                            id="email"
                            className="profile__input"
                            value={profileData.email || ""}
                            disabled
                        />
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="degree" className="profile__label">
                            Degree
                        </label>
                        <Select
                            value={
                                isCustomDegree
                                    ? "Other"
                                    : profileData.degree || ""
                            }
                            onValueChange={(value) => {
                                if (value === "Other") {
                                    setIsCustomDegree(true);
                                    setProfileData({
                                        ...profileData,
                                        degree: "",
                                    });
                                } else {
                                    setIsCustomDegree(false);
                                    setProfileData({
                                        ...profileData,
                                        degree: value,
                                    });
                                }
                            }}
                            disabled={!isEditing}
                        >
                            <SelectTrigger
                                id="degree"
                                className="profile__select"
                            >
                                <SelectValue placeholder="Select your highest degree" />
                            </SelectTrigger>
                            <SelectContent className="profile__select-content">
                                {predefinedDegrees.map((degree) => (
                                    <SelectItem
                                        key={degree}
                                        className="profile__select-item"
                                        value={degree}
                                    >
                                        {degree}
                                    </SelectItem>
                                ))}
                                <SelectItem
                                    className="profile__select-item"
                                    value="Other"
                                >
                                    Other
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {isCustomDegree && (
                            <div className="profile__form-group mt-4">
                                <label
                                    htmlFor="customDegree"
                                    className="profile__label"
                                >
                                    Other Degree
                                </label>
                                <Input
                                    id="customDegree"
                                    className="profile__input"
                                    placeholder="Enter your custom degree"
                                    value={profileData.degree || ""}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            degree: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div>
                        )}
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="title" className="profile__label">
                            Title
                        </label>
                        <Input
                            id="title"
                            className="profile__input"
                            placeholder="Enter your professional title"
                            value={profileData.title || ""}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    title: e.target.value,
                                })
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="university" className="profile__label">
                            University Affiliation
                        </label>
                        <Input
                            id="university"
                            className="profile__input"
                            placeholder="Enter your current university"
                            value={profileData.university || ""}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    university: e.target.value,
                                })
                            }
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="profile__form-group">
                        <label htmlFor="bio" className="profile__label">
                            Bio
                        </label>
                        <Textarea
                            id="bio"
                            rows={3}
                            className="profile__input !h-[unset] leading-[140%]"
                            placeholder="Write a brief bio"
                            value={profileData.bio || ""}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    bio: e.target.value,
                                })
                            }
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="profile__form-group">
                        <UpdatePassword isEditing={isEditing} />
                    </div>
                </form>
            </section>
            <Footer />
        </main>
    );
};

export default ProfilePage;
