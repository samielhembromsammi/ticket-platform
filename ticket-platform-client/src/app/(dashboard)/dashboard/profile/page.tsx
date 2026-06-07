"use client"
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import user_image from "@/src/assets/user.svg";
import Image from "next/image";
import { Spin, Tag, Descriptions } from "antd";
import dayjs from "dayjs";
import Title from "@/src/components/reuseable/title";
import { useMyProfile } from "@/src/hooks/dashboard/users";
import { statusColors, UserStatus } from "@/src/types";

type ProfileExtras = {
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};


export default function Profile() {
  const { profile, loading } = useMyProfile();
  const extendedProfile = (profile ?? {}) as ProfileExtras & NonNullable<typeof profile>;

  const statusColor = profile?.status?.toLowerCase() === "active" ? "green" : "red";

  return (
    <div className="space-y-8">
      <Title isShowBackButton title="Personal Information" />

      <Spin spinning={loading}>
        <div className="space-y-10 px-4">
          <section className="relative overflow-hidden rounded-3xl  text-black px-10 py-8 shadow">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-36 h-36 rounded-full border-4 border-white/40 overflow-hidden shadow-xl">
                  <Image
                    src={profile?.profileUrl ?? user_image}
                    alt="user avatar"
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                <Tag color={statusColor} className="!rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 capitalize">
                  {profile?.status ?? "Unknown"}
                </Tag>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-3">
                <Tag color={statusColor} className="uppercase tracking-widest text-sm ">
                  {profile?.role ?? "User"}
                </Tag>

                <h1 className="text-3xl lg:text-4xl font-semibold">
                  {profile?.fullName ?? "No name provided"}
                </h1>
                <p className=" max-w-xl">
                  {profile?.email ?? "No email on file"}
                </p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href="/dashboard/profile/edit">
                    <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition cursor-pointer">
                      <FaEdit /> Edit Profile
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Name
                  </span>
                }
              >
                {profile?.fullName ?? "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Email
                  </span>
                }
              >
                {profile?.email ?? "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Phone
                  </span>
                }
              >
                {profile?.phoneNumber ?? "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Address
                  </span>
                }
              >
                {extendedProfile?.address?.trim()
                  ? extendedProfile.address
                  : "Not provided"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Role
                  </span>
                }
              >
                <Tag color="green" className="!rounded-full capitalize">{profile?.role ?? "N/A"}</Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Status
                  </span>
                }
              >
                <Tag
                  color={statusColors[profile?.status as UserStatus] || "default"}
                  className="!rounded-full"
                >
                  {profile?.status ?? "N/A"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Created
                  </span>
                }
              >
                {extendedProfile?.createdAt
                  ? dayjs(extendedProfile?.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    Updated
                  </span>
                }
              >
                {extendedProfile?.updatedAt
                  ? dayjs(extendedProfile?.updatedAt).format("DD MMM YYYY")
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </section>
        </div>
      </Spin>
    </div>
  );
}
