import React, { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import "./Subscription.css";
import { useSchool } from "../../context/SchoolContext";
import { useAuth } from "../../context/AuthContext";
import { formatAmount } from "../../components/FormatAmount";
import { toTitleCase } from "../../utils/Utils";
import PaystackPayment from "../../components/PaystackPayment";
import { verifyPayments } from "../../services/schoolService";
import AlertModal from "../../components/modals/AlertModal/AlertModal";
import CustomSelectionInput from "../../components/CustomSelectionInput/CustomSelectionInput";

const Subscription = () => {
  const { schoolState, setSchoolDatas } = useSchool();
  const { authState, updateUser } = useAuth();
  const { user } = authState;
  const schoolSubscription = user?.school?.subscription;

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [successStatus, setSuccessStatus] = useState(false);
  const [noOfMembers, setNoOfMembers] = useState(1);
  const [selectedFeatures, setSelectedFeatures] = useState([1, 4]);
  const [duration, setDuration] = useState(1);
  const [activeAmount, setActiveAmount] = useState(0);

  const handleSuccess = async ({ reference, selectedPlan }) => {
    setLoading(true);
    const response = await verifyPayments(
      JSON.stringify({ reference, plan: selectedPlan }),
    );
    setLoading(false);
    if (response.status === "success") {
      setSchoolDatas(response.schoolData);
      updateUser(response.user);
      setMessage("Payment successful!");
      setSuccessStatus(true);
    } else {
      setMessage("Payment verification failed!");
      setSuccessStatus(false);
    }
  };

  const exemptedSchools = ["brooksmontessorischool", "coronahighschools"];

  const features = [
    { id: 1, name: "Admin Dashboard", price: 1000, compulsory: true },
    { id: 2, name: "Staff Dashboard", price: 500, compulsory: false },
    { id: 3, name: "Student Dashboard", price: 500, compulsory: false },
    { id: 4, name: "No. of School Members", price: 50, compulsory: true },
    {
      id: 5,
      name: "Digital Attendance System",
      price: 500,
      compulsory: false,
    },
    { id: 6, name: "Result Manager", price: 500, compulsory: false },
    { id: 7, name: "Tuition Fee Manager", price: 500, compulsory: false },
    {
      id: 8,
      name: "Virtual Classroom | Exam Manager",
      price: 2000,
      compulsory: false,
    },
    /* {
      id: 11,
      name: "Virtual Classroom Pro | Exam Manager",
      price: 7000,
      compulsory: false,
    }, */
    {
      id: 9,
      name: "Financial Dashboard",
      price: 500,
      compulsory: false,
    },
    {
      id: 10,
      name: "Email Notifications",
      price: 500,
      compulsory: false,
    },
  ];

  const grandTotal = features.reduce((sum, feature) => {
    if (selectedFeatures.includes(feature.id)) {
      return feature.id === 4
        ? sum + feature.price * noOfMembers // Multiply only if id is 4
        : sum + feature.price; // Otherwise, just add the price
    }
    return sum;
  }, 0);

  const discountedPrice =
    grandTotal * duration - (grandTotal * duration * 5) / 100;

  const [subscription, setSubscription] = useState({
    features: [1, 4],
    duration: 1,
    discount: false,
    noOfMembers: 1,
    amount: 0,
  });

  const checkValidPayable = () => {
    const withoutDiscount = grandTotal * duration - activeAmount <= 0;
    const withDiscount = discountedPrice - activeAmount <= 0;
    if (duration > 5) return withDiscount;
    else return withoutDiscount;
  };

  const handleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      const updatedFeature = selectedFeatures.filter((obj) => obj !== id);
      setSelectedFeatures([...updatedFeature]);
      setSubscription((prev) => ({ ...prev, features: [...updatedFeature] }));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
      setSubscription((prev) => ({
        ...prev,
        features: [...selectedFeatures, id],
      }));
    }
  };

  useEffect(() => {
    setSubscription((prev) => ({
      ...prev,
      amount: prev.discount
        ? discountedPrice - activeAmount
        : grandTotal * prev.duration - activeAmount,
    }));
  }, [discountedPrice, grandTotal]);

  useEffect(() => {
    if (schoolSubscription?.active) {
      setSubscription((prev) => ({
        ...prev,
        features: schoolSubscription.features,
        duration: schoolSubscription.duration,
        discount: schoolSubscription.discount,
        noOfMembers: schoolSubscription.members,
      }));
      setSelectedFeatures([...schoolSubscription.features]);
      setDuration(schoolSubscription?.duration);
      setNoOfMembers(schoolSubscription.members);
      setActiveAmount(schoolSubscription.amount);
    }
  }, [schoolSubscription]);

  const checkForChanges = () => {
    const difference = selectedFeatures.filter(
      (item) => !schoolSubscription.features.includes(item),
    );
    const differenceMembers = schoolSubscription.members - noOfMembers;
    const differenceMonth = schoolSubscription.duration - duration;

    return (
      difference.length > 0 || differenceMembers !== 0 || differenceMonth !== 0
    );
  };

  const [id, setId] = useState(0);

  useEffect(() => {
    setId((prev) => prev + 1);
  }, [user]);

  return (
    <div className="s-plan-container">
      <div className="onboarding-title">
        <h4>
          Your{" "}
          {schoolSubscription?.subscription_ref_number
            ? "current subscription"
            : "trial"}{" "}
          will expire on:{" "}
          {user?.school?.subscription?.subscription_end_date || "N/A"}
        </h4>
        <br />
        <h3>Manage Your Subscription</h3>
        <p>
          Easily upgrade or extend your subscription by selecting the features
          that best suit your school's needs.
        </p>
      </div>

      <div className="subscription-content">
        <div className="new-table-style">
          <table>
            <thead>
              <tr className="heading-style">
                <th></th>
                <th>Feature</th>
                <th>Qty.</th>
                <th>Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {features.map((obj, index) => (
                <tr className="content-style" key={index}>
                  <td
                    style={{
                      paddingLeft: "5px",
                      paddingRight: "5px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(obj.id)}
                      disabled={obj.id === 1 || obj.id === 4}
                      onChange={() => handleFeature(obj.id)}
                    />
                  </td>

                  <td>{obj?.name}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={obj?.name.includes("Members") ? noOfMembers : 1}
                      disabled={!obj?.name.includes("Members")}
                      onChange={(e) => {
                        setNoOfMembers(e.target.value);
                        setSubscription((prev) => ({
                          ...prev,
                          noOfMembers: e.target.value,
                        }));
                      }}
                    />
                  </td>
                  <td>₦{formatAmount(obj?.price)}</td>
                  <td>
                    ₦
                    {formatAmount(
                      obj?.name.includes("Members")
                        ? obj?.price * noOfMembers
                        : obj?.price,
                    )}
                  </td>
                </tr>
              ))}
              <tr className="content-style" style={{ fontWeight: 600 }}>
                <td colSpan={4}>Grand Total</td>
                <td>₦{formatAmount(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="subscription-aside">
          <CustomSelectionInput
            placeholder={"Duration"}
            name={"duration"}
            value={duration}
            handleChange={(e) => {
              setDuration(e.target.value);
              setSubscription((prev) => ({
                ...prev,
                duration: e.target.value,
                discount: e.target.value >= 6,
              }));
            }}
            options={[
              { label: "1-month", value: 1 },
              { label: "2-months", value: 2 },
              { label: "3-months", value: 3 },
              { label: "4-months", value: 4 },
              { label: "5-months", value: 5 },
              { label: "6-months", value: 6 },
              { label: "7-months", value: 7 },
              { label: "8-months", value: 8 },
              { label: "9-months", value: 9 },
              { label: "10-months", value: 10 },
              { label: "11-months", value: 11 },
              { label: "12-months", value: 12 },
            ]}
          />
          <p className="discount-text">5% off for 6months & above.</p>
          <div className="new-table-style">
            <table>
              <thead>
                <tr className="heading-style">
                  <th colSpan={2}>Total Subscription Bill</th>
                </tr>
              </thead>
              <tbody>
                <tr className="content-style">
                  <td>Grand Total</td>
                  <td>₦{formatAmount(grandTotal)}</td>
                </tr>
                <tr className="content-style">
                  <td>No of Months</td>
                  <td>x {duration}</td>
                </tr>
                <tr className="content-style" style={{ fontWeight: 600 }}>
                  <td>Total</td>
                  <td>
                    {schoolSubscription?.active &&
                      checkForChanges() &&
                      activeAmount > 0 && (
                        <span>
                          <span className={"deduct-price"}>
                            ₦{formatAmount(grandTotal * duration)} - ₦
                            {formatAmount(activeAmount)}
                          </span>
                          <br />
                        </span>
                      )}
                    {subscription.discount && (
                      <span style={{ fontSize: "18px" }}>
                        ₦{formatAmount(discountedPrice - activeAmount)} (5% off)
                      </span>
                    )}
                    {subscription.discount && <br />}
                    <span
                      className={subscription.discount && "strikethrough"}
                      style={{ fontSize: "18px" }}
                    >
                      ₦
                      {formatAmount(
                        grandTotal * duration - activeAmount < 0
                          ? 0
                          : grandTotal * duration - activeAmount,
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            className={`btn-container paystack-white-btn}`}
            disabled={checkValidPayable()}
            style={{
              opacity: checkValidPayable() ? 0.4 : 1,
            }}
          >
            <PaystackPayment
              paystackClassName="btn"
              amount={
                subscription.discount
                  ? discountedPrice - activeAmount
                  : grandTotal * duration - activeAmount
              }
              email={user?.email_address}
              selectedPlan={subscription}
              onSuccess={handleSuccess}
              loading={loading}
              onClose={() => {
                setMessage("Payment closed");
                setSuccessStatus(false);
              }}
            />
          </button>
          <div className="paystack-secure">
            <img
              src="https://i0.wp.com/www.everymedical.com.ng/wp-content/uploads/2020/07/paystack-ii.png?ssl=1"
              alt=""
              srcset=""
            />
          </div>
        </div>
      </div>
      <AlertModal
        isVisible={message ? true : false}
        onClose={() => setMessage("")}
        message={message}
        success={successStatus}
      />
    </div>
  );
};

export default Subscription;
