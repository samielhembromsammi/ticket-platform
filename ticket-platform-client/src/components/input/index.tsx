"use client";
import { Input } from "antd";
import {
    Bold,
    Italic,
    Link,
    List,
    ListOrdered,
    Strikethrough,
    Underline,
} from "lucide-react";

export const ExpertTipsInput = ({ value, onChange, ...props }: any) => {
    return (
        <div className="relative">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white mt-3">
                <Input.TextArea
                    {...props}
                    value={value}
                    onChange={onChange}
                    placeholder="Add your expert tip..."
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    className="border-none shadow-none focus:shadow-none resize-none text-gray-600 p-4 !ring-0 !outline-none"
                    variant="borderless"
                />
            </div>
            <div className="flex justify-end text-xs text-gray-400 mt-1 absolute right-0">
                Write at least 100 characters.
            </div>
        </div>
    );
};

export const DescriptionInput = ({ value, onChange, ...props }: any) => {
    return (
        <div className="relative">
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white mt-3 custom-textarea [transition:0.3s]">
                <Input.TextArea
                    {...props}
                    value={value}
                    onChange={onChange}
                    placeholder="Add your resource description..."
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    className="border-none shadow-none focus:shadow-none resize-none text-gray-600 p-4 !ring-0 !outline-none custom-textarea"
                    variant="borderless"
                />

                <div className="flex items-center gap-4 px-4 pb-3 text-gray-400 border-t border-transparent">
                    <button type="button" className="hover:text-gray-600"><Bold className="w-4 h-4" /></button>
                    <button type="button" className="hover:text-gray-600"><Italic className="w-4 h-4" /></button>
                    <button type="button" className="hover:text-gray-600"><Underline className="w-4 h-4" /></button>
                    <button type="button" className="hover:text-gray-600"><Strikethrough className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button type="button" className="hover:text-gray-600"><Link className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button type="button" className="hover:text-gray-600"><List className="w-4 h-4" /></button>
                    <button type="button" className="hover:text-gray-600"><ListOrdered className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="flex justify-end text-xs text-gray-400 mt-1 mb-4 absolute right-0">
                Write at least 300 characters.
            </div>
        </div>
    );
};