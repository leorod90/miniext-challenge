/* eslint-disable @next/next/no-img-element */
import { EmailAuthProvider, RecaptchaVerifier, getAuth, linkWithCredential, updateEmail } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import ToastBox from '@/components/ui/ToastBox';
import { useAppDispatch } from '@/components/redux/store';
import { showToast } from '@/components/redux/toast/toastSlice';
import Input from '@/components/ui/Input';
import LoadingButton from '@/components/ui/LoadingButton';
import Logout from './Logout';
import { useAuth } from '../useAuth';
import { LoadingStateTypes } from '../redux/types';
import {
    sendVerificationCode,
    useSendVerificationCodeLoading,
    useVerifyPhoneNumberLoading,
    verifyPhoneNumber,
} from '../redux/auth/verifyPhoneNumber';
import PhoneVerificationInput from './PhoneVerificationInput';
import { getFriendlyMessageFromFirebaseErrorCode } from '../redux/auth/helpers';

const Verification = () => {
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const router = useRouter();
    // const [phoneNumber, setPhoneNumber] = useState('');
    // const [OTPCode, setOTPCode] = useState('');
    // const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // const sendVerificationLoading = useSendVerificationCodeLoading();
    // const verifyPhoneNumberLoading = useVerifyPhoneNumberLoading();

    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    // const [verificationId, setVerificationId] = useState('');
    // const router = useRouter();

    // Sending OTP and storing id to verify it later
    // const handleSendVerification = async () => {
    //     if (auth.type !== LoadingStateTypes.LOADED) return;

    //     dispatch(
    //         sendVerificationCode({
    //             phoneNumber,
    //             auth,
    //             recaptcha,
    //             recaptchaResolved,
    //             callback: (result) => {
    //                 if (result.type === 'error') {
    //                     setRecaptchaResolved(false);
    //                     return;
    //                 }
    //                 setVerificationId(result.verificationId);
    //                 setShow(true);
    //             },
    //         })
    //     );
    // };

    // Validating the filled OTP by user
    // const ValidateOtp = async () => {
    //     if (auth.type !== LoadingStateTypes.LOADED) return;
    //     dispatch(
    //         verifyPhoneNumber({
    //             auth,
    //             OTPCode,
    //             verificationId,
    //             callback: (result) => {
    //                 if (result.type === 'error') {
    //                     return;
    //                 }
    //                 // needed to reload auth user
    //                 router.refresh();
    //             },
    //         })
    //     );
    // };

    // generating the recaptcha on page render
    useEffect(() => {

        if (auth?.user?.phoneNumber == null) {
            try {
                const captcha = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
                    size: 'normal',
                    callback: () => {
                        setRecaptchaResolved(true);
                    },

                    'expired-callback': () => {
                        setRecaptchaResolved(false);
                        dispatch(
                            showToast({
                                message: 'Recaptcha Expired, please verify it again',
                                type: 'info',
                            })
                        );
                    },
                });

                captcha.render();

                setRecaptcha(captcha);
            } catch (error) {

            }
        }

    }, []);

    const updateEmailHandler = async () => {
        try {
            const credential = EmailAuthProvider.credential(email, password);

            const usercred = await linkWithCredential(firebaseAuth.currentUser, credential);
            const user = usercred.user;
            firebaseAuth.currentUser?.reload();
            router.refresh();
        } catch (error) {
            console.error("Account linking error", error);
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'info',
                })
            );
        }
    };


    return (
        <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <img
                    className="w-auto h-12 mx-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                />
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                    We Need Some More Data 😃
                </h2>
                <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">

                    {auth?.user?.phoneNumber == null && (
                        <PhoneVerificationInput
                            recaptcha={recaptcha}
                            recaptchaResolved={recaptchaResolved}
                            setRecaptchaResolved={setRecaptchaResolved}
                        />

                    )}
                    {/* <div id="recaptcha-container" className={`${auth?.user?.phoneNumber == null ? '' : 'hidden'}`} /> */}
                    <div id="recaptcha-container" />

                    {auth?.user?.email == null && (
                        <div className="flex gap-4 mb-5 flex-col">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                name="email"
                                type="text"
                            />
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                name="password"
                                type="text"
                            />
                            <LoadingButton
                                onClick={updateEmailHandler}
                                // disabled={disableSubmit}
                                loading={isLoading}
                            >
                                Add Email
                            </LoadingButton>

                        </div>
                    )}
                    <div className="flex w-full flex-col mt-2">
                        <Logout />
                    </div>
                </div>

            </div>
            <ToastBox />
        </div>
    );
};

export default Verification;
