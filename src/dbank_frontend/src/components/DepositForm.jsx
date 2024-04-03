import { dbank_backend } from 'declarations/dbank_backend';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function DepositForm({ setLoading, updateBalance }) {
    const handleSubmit = async (values, actions) => {
        try {
            setLoading(true);

            const topUp = parseFloat(values.topUpAmount);
            const response = await dbank_backend.deposit(topUp);

            if (Number(response.statusCode) === 200) {
                updateBalance();
                actions.resetForm();
                toast.success("Depositing money is successful.");

            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error while depositing money: ', error);
            toast.error("Error while depositing money.");
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            topUpAmount: '',
        },
        validationSchema: Yup.object({
            topUpAmount: Yup.number()
                .typeError('Enter a valid number')
                .required("Required")
                .min(0, 'Amount must be greater than or equal to 0'),
        }),
        onSubmit: handleSubmit,
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Amount to Top Up</h2>
            <input
                id="topup-amount"
                type="number"
                step="0.01"
                min="0"
                name="topUpAmount"
                value={formik.values.topUpAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.topUpAmount && formik.errors.topUpAmount ? (
                <div>{formik.errors.topUpAmount}</div>
            ) : null}
            <input className="btn" type="submit" value="Deposit" />
        </form>
    );
}