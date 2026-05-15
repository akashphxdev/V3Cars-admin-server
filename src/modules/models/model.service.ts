// src/modules/models/model.service.ts

import prisma from '../../config/db';
import { ModelName } from './model.types';

export const getModelsByBrandId = async (brandId: number): Promise<ModelName[]> => {
  const models = await prisma.tblmodels.findMany({
    where: {
      brandId,
      isUpcoming: false,
    },
    select: {
      modelId: true,
      modelName: true,
    },
    orderBy: { modelName: 'asc' },
  });

  return models as ModelName[];
};