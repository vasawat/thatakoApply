import { useForm } from 'react-hook-form'

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const grade = ['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'];
const major = [
  {
    value: 'sciMath',
    label: 'สายวิทยาศาสตร์และคณิตศาสตร์',
  },
  {
    value: 'physChem',
    label: 'สายศิลคำนวน',
  }
];

export default function Apply(params) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        console.log(data);
    }

    return (
        <>
            <div className="w-full h-screen bg-gray-200 overflow-auto grid place-items-center">
                <div className="w-2/3 p-6 rounded-xl bg-gray-300">
                    <div className='grid grid-cols-2 gap-4'>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth/>
                        <TextField
                            id="outlined-select-grade"
                            select
                            label="ระดับชั้น"
                            defaultValue="ม.1"
                            // helperText="Please select your currency"
                            >
                            {grade.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="outlined-select-major"
                            select
                            label="Select"
                            defaultValue="sciMath"
                            // helperText="Please select your currency"
                            >
                            {major.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className='grid place-items-center mt-5'>
                        <Button onClick={handleSubmit(onSubmit)} color="success" variant="contained" fullWidth>เข้าสู่ระบบ</Button>
                    </div>
                    
                </div>
            </div>
        </>
    )
};
