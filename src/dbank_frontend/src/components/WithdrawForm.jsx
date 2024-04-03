import { dbank_backend } from 'declarations/dbank_backend';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function WithdrawForm({ setLoading, updateBalance }) {
    const handleSubmit = async (values, actions) => {
        try {
            setLoading(true);
            const response = await dbank_backend.withdraw(values.withdrawalAmount);

            if (Number(response.statusCode) === 200) {
                updateBalance();
                actions.resetForm();
                toast.success("Withdrawing money is successful.");

            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error while withdrawing money: ', error);
            toast.error("Error while withdrawing money.");
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            withdrawalAmount: '',
        },
        validationSchema: Yup.object({
            withdrawalAmount: Yup.number()
                .typeError('Enter a valid number')
                .required("Required")
                .min(0, 'Amount must be greater than or equal to 0'),
        }),
        onSubmit: handleSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Amount to Withdraw</h2>
            <input
                id="withdrawal-amount"
                type="number"
                step="0.01"
                min="0"
                name="withdrawalAmount"
                value={formik.values.withdrawalAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.withdrawalAmount && formik.errors.withdrawalAmount ? (
                <div>{formik.errors.withdrawalAmount}</div>
            ) : null}
            <input className="btn" type="submit" value="Withdraw" />
        </form>
    );
}