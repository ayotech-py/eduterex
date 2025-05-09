import React, { useEffect } from "react";
import { PaystackButton } from "react-paystack";
import Loading from "../utils/Loader";

const P_P_K = process.env.REACT_APP_P_P_K;

const PaystackPayment = ({
  amount,
  email,
  onSuccess,
  loading,
  selectedPlan,
  onClose,
  paystackClassName,
}) => {
  const config = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey: P_P_K,
  };

  const handleSuccess = (reference) => {
    onSuccess({ reference: reference, selectedPlan: selectedPlan });
  };

  const handleClose = () => {
    onClose();
  };

  return loading ? (
    <Loading />
  ) : (
    <PaystackButton
      {...config}
      text="Pay Now"
      className={paystackClassName}
      onSuccess={handleSuccess}
      onClose={handleClose}
    />
  );
};

export default PaystackPayment;
