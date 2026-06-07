/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { Input, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import Title from "@/src/components/reuseable/title";
import { useTermsService, useUpdateTermService } from "@/src/hooks/dashboard/settings";


const { TextArea } = Input;

export default function TermsAndServiceEditPage() {
  const { terms, refetch } = useTermsService();
  const { updateTerm } = useUpdateTermService();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const term = terms?.[0];

  useEffect(() => {
    if (term?.content) setContent(term.content);
  }, [term]);

  const handleUpdate = async (): Promise<void> => {
    if (!term?._id) {
      message.error("No term found to update!");
      return;
    }
    try {
      setLoading(true);
      await updateTerm(term?._id, { content });
      await refetch();
      message.success("Terms & Conditions updated successfully!");
      router.push("/dashboard/settings/terms-service")
    } catch (error) {
      // console.error(error);
      message.error("Failed to update terms.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title isShowBackButton title="Edit Terms and Conditions" />
      <div className="p-4">
        <TextArea
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your terms and conditions here..."
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
