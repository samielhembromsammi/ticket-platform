/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useEffect, useState } from "react";
import { Input, message, Spin } from "antd";
import {
  useAboutUsService,
  useUpdateAboutUs,
} from "../../../../../../hooks/dashboard/settings";
import { useRouter } from "next/navigation";
import Title from "@/src/components/reuseable/title";


const { TextArea } = Input;

export default function AboutUsEditPage() {
  const { abouts, refetch } = useAboutUsService();
  const { updateAbout } = useUpdateAboutUs();
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter()

  const about = abouts?.[0];

  useEffect(() => {
    if (about?.content) setContent(about.content);
  }, [about]);

  const handleUpdate = async (): Promise<void> => {
    if (!about?._id) {
      message.error("No about found to update!");
      return;
    }
    try {
      setLoading(true);
      await updateAbout(about?._id, { content });
      await refetch();
      message.success("About us updated successfully!");
      router.push("/dashboard/settings/about-us")
    } catch (error) {
      // console.error(error);
      message.error("Failed to update about us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Title isShowBackButton title="Edit About Us" />
      <div className="p-4">
        <TextArea
          rows={16}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your about us here..."
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
