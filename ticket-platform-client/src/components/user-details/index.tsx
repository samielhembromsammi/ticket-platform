import { Avatar, Button, message } from "antd";
import { IUser } from "@/src/hooks/dashboard/user-manage/interface";
import dayjs from "dayjs";
import { MdOutlineEmail, MdDateRange } from "react-icons/md";
import { TbClipboardText } from "react-icons/tb";

interface UserDetailsModalContentProps {
    user: IUser | null;
    onCancel: () => void;
}

export default function UserDetailsModalContent({
    user,
    onCancel,
}: UserDetailsModalContentProps) {
    if (!user) return null;

    const initials = user.fullName
        ?.split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const handleSuspend = () => {
        console.log("Suspend user:", user._id);
    };

    const InfoCard = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }) => (
        <div className="bg-[#F6F0FF] p-4 rounded-lg flex items-center gap-4 mb-3">
            <div className="min-w-[40px] h-[40px] rounded-full bg-[#9B4EFF] flex items-center justify-center text-white text-xl">
                {icon}
            </div>
            <div>
                <p className="text-gray-800 font-medium text-sm mb-0.5">{label}</p>
                <p className="text-gray-500 text-sm m-0">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center">
            {/* Header */}
            <div className="mb-6 flex flex-col items-center">
                <Avatar
                    size={80}
                    src={user.profilePhoto}
                    className="!bg-gray-200 !text-gray-700 !text-2xl mb-3 border-4 border-white shadow-sm"
                >
                    {initials}
                </Avatar>
                <h3 className="text-xl font-bold text-gray-800 m-0">{user.fullName}</h3>
                <p className="text-gray-500 m-0 capitalize">{user.role}</p>
            </div>

            {/* Details */}
            <div className="w-full">
                <InfoCard
                    icon={<MdDateRange />}
                    label="Date of Birth"
                    value={
                        user.dateOfBirth
                            ? dayjs(user.dateOfBirth).format("DD MMMM YYYY")
                            : "N/A"
                    }
                />
                <InfoCard
                    icon={<MdOutlineEmail />}
                    label="Email"
                    value={user.email || "N/A"}
                />
                <InfoCard
                    icon={<TbClipboardText />}
                    label="Signup Date"
                    value={
                        user.createdAt
                            ? dayjs(user.createdAt).format("DD MMMM YYYY")
                            : "N/A"
                    }
                />
            </div>

            {/* Actions */}
            <div className="w-full mt-4">
                <Button
                    type="primary"
                    danger
                    block
                    size="large"
                    onClick={handleSuspend}
                    className="!bg-[#FF0022] hover:!bg-[#d9001d] !h-12 !rounded-lg text-lg font-medium"
                >
                    Suspend
                </Button>
            </div>
        </div>
    );
}
