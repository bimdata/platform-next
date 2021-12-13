import VisaService from "@/services/VisaService";

const createVisa = async (description, date, baseInfo) => {
  return VisaService.createVisa(description, date, baseInfo);
};

const createValidation = async (visaId, validatorId, baseInfo) => {
  return VisaService.createValidation(visaId, validatorId, baseInfo);
};

export function useVisa() {
  return {
    // Methods
    createVisa,
    createValidation
  };
}
