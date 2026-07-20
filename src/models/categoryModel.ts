import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add toJSON transformation to clean up output
categorySchema.set('toJSON', {
  transform: (doc: any, ret: Record<string, any>) => {
    // __v may not exist on the returned object; ensure type-safety
    if ('__v' in ret) {
      delete ret.__v;
    }
    return ret;
  },
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;