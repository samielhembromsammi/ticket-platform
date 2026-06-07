/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { Input, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import Title from "@/src/components/reuseable/title";
import { usePrivacyPolicyService, useUpdatePrivacyPolicy } from "@/src/hooks/dashboard/settings";


const { TextArea } = Input;

export default function PrivacyPolicyEditPage() {
  const { policies, refetch } = usePrivacyPolicyService();
  const { updatePolicy } = useUpdatePrivacyPolicy();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const policy = policies?.[0];

  useEffect(() => {
    if (policy?.content) setContent(policy.content);
  }, [policy]);

  const handleUpdate = async (): Promise<void> => {
    if (!policy?._id) {
      message.error("No term found to update!");
      return;
    }
    try {
      setLoading(true);
      await updatePolicy(policy?._id, { content });
      await refetch();
      message.success("Privacy Policy updated successfully!");
      router.push("/dashboard/settings/privacy-policy")
    } catch (error) {
      // console.error(error);
      message.error("Failed to update policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title isShowBackButton title="Edit Privacy Policy" />
      <div className="p-4">
        <TextArea
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your privacy policy here..."
          className="custom-textarea"
          style={{
            borderRadius: "10px",
            fontSize: "16px",
            lineHeight: "1.6",
            borderColor: "#ccc",
            transition: "border-color 0.3s ease",
          }}
        />
        <div className="w-max ml-auto my-8">
          <button
            onClick={handleUpdate}
            className="bg-primary text-white py-2 px-14 rounded-full cursor-pointer flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <p className="flex items-center gap-2">
              <Spin size="small" />
              <span>Loading...</span>
            </p> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

