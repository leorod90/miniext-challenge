// import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
// import { CgSpinner } from "react-icons/cg";

// import OtpInput from "otp-input-react";
import { useState } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { auth } from "./firebase.config";
import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from "firebase/auth";
import { firebaseAuth } from "../firebase/firebaseAuth";
import Modal from "./Modal";
import Input from "./Input";
import LoadingButton from "./LoadingButton";
import { showToast } from "../redux/toast/toastSlice";
import { getFriendlyMessageFromFirebaseErrorCode } from "../redux/auth/helpers";
import ToastBox from "./ToastBox";
import { useAppDispatch } from "../redux/store";
// import { toast, Toaster } from "react-hot-toast";

const PhoneSignUp = () => {
  const auth = getAuth()
  const dispatch = useAppDispatch();
  // auth.languageCode = 'it';

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  function onCaptchVerify() {
    try {
      if (!window.recaptchaVerifier && document.getElementById('recaptcha-container-invis')) {
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, "recaptcha-container-invis", {
          size: "invisible",
          callback: () => {
            onSignup();
          },

          'expired-callback': () => {
            window.recaptchaVerifier?.recaptcha?.reset()
            // window.recaptchaVerifier.recaptcha.reset();
            dispatch(showToast({
              message: getFriendlyMessageFromFirebaseErrorCode("oops something went wrong!"),
              type: 'error',
            }))
          },
        });
      }
    } catch (error) {
      console.log(error)
    }

  }

  // function onSignup() {
  //   setLoading(true);
  //   onCaptchVerify();

  //   const appVerifier = window.recaptchaVerifier;

  //   // let formatPh = "+" + ph;

  //   // formatPh = '+1 917 856 0914'
  //   signInWithPhoneNumber(auth, ph, appVerifier)
  //     .then((confirmationResult) => {
  //       window.confirmationResult = confirmationResult;
  //       setLoading(false);
  //       setShow(true);
  //       // toast.success("OTP sended successfully!");
  //     })
  //     .catch((error) => {
  //       console.log(error.code)
  //       showToast({
  //         message: "getFriendlyMessageFromFirebaseErrorCode(error.code)",
  //         type: 'error',
  //       })
  //       setLoading(false);
  //     });
  // }
  async function onSignup() {
    setLoading(true);
    onCaptchVerify();

    try {
      const appVerifier = window.recaptchaVerifier;
      window.recaptchaVerifier?.recaptcha?.reset()
      const confirmationResult = await signInWithPhoneNumber(auth, ph, appVerifier);

      window.confirmationResult = confirmationResult;
      setLoading(false);
      setShow(true);

    } catch (error) {
      console.error(error);
      dispatch(showToast({
        message: getFriendlyMessageFromFirebaseErrorCode(error.code), // Assuming getFriendlyMessageFromFirebaseErrorCode is a function that returns a user-friendly message based on the Firebase error code
        type: 'error',
      }))
      window.recaptchaVerifier?.recaptcha?.reset()
      setShow(false);
      setLoading(false);
    }
  }



  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
      })
      .catch((error) => {
        dispatch(showToast({
          message: getFriendlyMessageFromFirebaseErrorCode(error.code),
          type: 'error',
        }))
        setLoading(false);
      });
  }

  return (
    <div>
      {/* <Toaster toastOptions={{ duration: 4000 }} /> */}
      <div id="recaptcha-container-invis" />
      <div className="px-4 flex p-4 pb-0 gap-4 flex-col">
        <Input
          value={ph}
          onChange={(e) => setPh(e.target.value)}
          placeholder="+1 123 456 7890"
          type="text"
        />
        <LoadingButton
          onClick={onSignup}
          // loading={loading}
          loadingText="Sending OTP"
        >
          Send OTP
        </LoadingButton>
      </div>
      <Modal show={show} setShow={setShow}>
        <div className="max-w-xl w-full bg-white py-6 rounded-lg">
          <h2 className="text-lg font-semibold text-center mb-10">
            Enter Code to Verify
          </h2>
          <div className="px-4 flex items-center gap-4 pb-10">
            <Input
              value={otp}
              type="text"
              placeholder="Enter your OTP"
              onChange={(e) => setOtp(e.target.value)}
            />

            <LoadingButton
              onClick={onOTPVerify}
              loading={loading}
              loadingText="Verifying..."
            >
              Verify
            </LoadingButton>
          </div>
        </div>
      </Modal>
      <ToastBox />
    </div>
  );
};

export default PhoneSignUp;