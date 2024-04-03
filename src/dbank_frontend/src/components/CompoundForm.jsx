import { dbank_backend } from 'declarations/dbank_backend';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function CompoundForm({ setLoading, updateBalance }) {
    const handleSubmit = async (values, actions) => {
        try {
            setLoading(true);

            const compoundAmount = parseFloat(values.compoundAmount);
            const response = await dbank_backend.startCompound(compoundAmount);

            if (Number(response.statusCode) === 200) {
                updateBalance();
                actions.resetForm();
                toast.success(response.message);

            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error while starting compound: ', error);
            toast.error("Error while starting compound.");
        } finally {
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            compoundAmount: '',
        },
        validationSchema: Yup.object({
            compoundAmount: Yup.number()
                .typeError('Enter a valid number')
                .required("Required")
                .min(0, 'Amount must be greater than or equal to 0'),
        }),
        onSubmit: handleSubmit
    });

    const handleEndCompoundClick = async () => {
        try {
            setLoading(true);

            const response = await dbank_backend.endCompound();

            if (Number(response.statusCode) === 200) {
                toast.success(response.message);
                updateBalance();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error('Error while ending compound: ', error);
            toast.error("Error while ending compound.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <h2>Amount to Compound</h2>
            <input
                id="compound-amount"
                type="number"
                step="0.01"
                min="0"
                name="compoundAmount"
                value={formik.values.compoundAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.touched.compoundAmount && formik.errors.compoundAmount ? (
                <div>{formik.errors.compoundAmount}</div>
            ) : null}
            <input className="btn" type="submit" value="Start Compound" />
            <input className="btn" type="button" value="End Compound" onClick={handleEndCompoundClick} />
        </form>
    );
}