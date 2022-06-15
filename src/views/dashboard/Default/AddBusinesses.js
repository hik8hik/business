import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// back-end
import axios from 'axios';

// navigation
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Button,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Typography,
    Box,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const PopularCard = ({ isLoading }, { ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Add Business</Typography>
                                    </Grid>
                                    <Grid item>
                                        <MoreHorizOutlinedIcon
                                            fontSize="small"
                                            sx={{
                                                color: theme.palette.primary[200],
                                                cursor: 'pointer'
                                            }}
                                            aria-controls="menu-popular-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        />
                                        <Menu
                                            id="menu-popular-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}> Today</MenuItem>
                                            <MenuItem onClick={handleClose}> This Month</MenuItem>
                                            <MenuItem onClick={handleClose}> This Year </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ pt: '16px !important' }}>
                                <Formik
                                    initialValues={{
                                        category: '',
                                        subcategory: '',
                                        name: '',
                                        password: '',
                                        submit: true
                                    }}
                                    validationSchema={Yup.object().shape({
                                        category: Yup.string().max(255).required('category is required'),
                                        subcategory: Yup.string().max(255).required('Sub-category is required'),
                                        name: Yup.string().max(255).required('Bisiness name is required'),
                                        password: Yup.string().max(255).required('Password is required')
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        const config = {
                                            headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('authToken')}`
                                            }
                                        };

                                        const token = localStorage.getItem('authToken');
                                        const category = values.category;
                                        const subcategory = values.subcategory;
                                        const name = values.name;
                                        const password = values.password;
                                        try {
                                            const { data } = await axios.post(
                                                '/api/private/createbusiness',
                                                { token, category, subcategory, name, password },
                                                config
                                            );

                                            alert(data.data);

                                            if (scriptedRef.current) {
                                                setStatus({ success: true });
                                                setSubmitting(true);
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            if (scriptedRef.current) {
                                                setStatus({ success: false });
                                                setErrors({ submit: err.message });
                                                setSubmitting(false);
                                            }
                                        }
                                    }}
                                >
                                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                        <form noValidate onSubmit={handleSubmit} {...others}>
                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.category && errors.category)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-create-category">Business Category</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-create-category"
                                                    type="text"
                                                    value={values.category}
                                                    name="category"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    label="Business Category"
                                                    inputProps={{}}
                                                />
                                                {touched.category && errors.category && (
                                                    <FormHelperText error id="standard-weight-helper-text-create-category">
                                                        {errors.category}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.subcategory && errors.subcategory)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-create-subcategory">Sub Category</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-create-subcategory"
                                                    type="text"
                                                    value={values.subcategory}
                                                    name="subcategory"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    label="Sub Category"
                                                    inputProps={{}}
                                                />
                                                {touched.subcategory && errors.subcategory && (
                                                    <FormHelperText error id="standard-weight-helper-text-create-subcategory">
                                                        {errors.subcategory}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.name && errors.name)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-create-business_name">Business Name</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-create-business_name"
                                                    type="text"
                                                    value={values.name}
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    label="Business Name"
                                                    inputProps={{}}
                                                />
                                                {touched.name && errors.name && (
                                                    <FormHelperText error id="standard-weight-helper-text-create-business_name">
                                                        {errors.name}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>

                                            <FormControl
                                                fullWidth
                                                error={Boolean(touched.password && errors.password)}
                                                sx={{ ...theme.typography.customInput }}
                                            >
                                                <InputLabel htmlFor="outlined-adornment-create-password">Password</InputLabel>
                                                <OutlinedInput
                                                    id="outlined-adornment-create-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={values.password}
                                                    name="password"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                                edge="end"
                                                                size="large"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }
                                                    label="Password"
                                                    inputProps={{}}
                                                />
                                                {touched.password && errors.password && (
                                                    <FormHelperText error id="standard-weight-helper-text-create-password">
                                                        {errors.password}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                                <Typography
                                                    variant="subtitle1"
                                                    color="secondary"
                                                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                                                >
                                                    Cancel
                                                </Typography>
                                            </Stack>
                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}

                                            <Box sx={{ mt: 2 }}>
                                                <AnimateButton>
                                                    <Button
                                                        disableElevation
                                                        disabled={isSubmitting}
                                                        fullWidth
                                                        size="large"
                                                        type="submit"
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Register Business
                                                    </Button>
                                                </AnimateButton>
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
                        <Button size="small" disableElevation>
                            View Your Businesses
                            <ChevronRightOutlinedIcon />
                        </Button>
                    </CardActions>
                </MainCard>
            )}
        </>
    );
};

PopularCard.propTypes = {
    isLoading: PropTypes.bool
};

export default PopularCard;
