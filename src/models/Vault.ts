import mongoose, { Schema, models } from 'mongoose';

export interface IVault {
  userId: mongoose.Types.ObjectId;
  encryptedData: string;
  salt: string;
  createdAt: Date;
  updatedAt: Date;
}

const VaultSchema = new Schema<IVault>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    encryptedData: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Vault = models.Vault || mongoose.model<IVault>('Vault', VaultSchema);

export default Vault;