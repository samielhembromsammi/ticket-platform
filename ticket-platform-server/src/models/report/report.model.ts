import { model, Schema } from "mongoose";

export interface IReport {
  title: string;
  type: "financial" | "user_growth" | "event_performance";
  data: any;
  generatedBy: string;
}

const reportSchema = new Schema<IReport>(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["financial", "user_growth", "event_performance"],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
    generatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = model<IReport>("Report", reportSchema);
