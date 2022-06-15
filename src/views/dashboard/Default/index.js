import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

// material-ui
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography, Grid, Card } from '@mui/material';

// project imports
import Businesses from './businesses';
import AddBusiness from './AddBusinesses';
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import NoBusinessLightCard from './NoBusinessLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';

// assets
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));

// ===============================|| SHADOW BOX ||=============================== //

const ShadowBox = ({ shadow }) => (
    <Card sx={{ mb: 3, boxShadow: shadow }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4.5,
                bgcolor: 'primary.light',
                color: 'grey.800'
            }}
        >
            <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>
        </Box>
    </Card>
);

ShadowBox.propTypes = {
    shadow: PropTypes.string.isRequired
};

// ==============================|| BUSINESS CARD ||============================== //
const BusinessCard = ({ isLoading }, { names }) => {
    const theme = useTheme();

    const [businesses, setBusinesses] = useState([]);

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    };

    useEffect(() => {
        const getData = async () => {
            try {
                await axios.get(`/api/private/getuserbusinesses`, config).then((response) => {
                    setBusinesses(response.data.data);
                });
            } catch (error) {
                console.error(error.message);
            }
        };

        getData();
    }, []);

    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <List sx={{ py: 0 }}>
                            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.largeAvatar,
                                            backgroundColor: theme.palette.warning.light,
                                            color: theme.palette.warning.dark
                                        }}
                                    >
                                        <StorefrontTwoToneIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        py: 0,
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    primary={
                                        businesses.length >= 1 ? (
                                            <Typography variant="h4">Your Businesses.</Typography>
                                        ) : (
                                            <Typography variant="h4">It is lonely here.</Typography>
                                        )
                                    }
                                    secondary={
                                        businesses.length >= 1 ? (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                CLick on any business to launch it.
                                                {businesses.map((option) => (
                                                    <Button key={option.name} variant="text">
                                                        {option.name}
                                                    </Button>
                                                ))}
                                            </Typography>
                                        ) : (
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.grey[500],
                                                    mt: 0.5
                                                }}
                                            >
                                                You don&apos;t have any business to to show here. You can create a business from here the
                                                button below.
                                                {businesses.map((option) => (
                                                    <p key={option.name} value={option.name}>
                                                        {`Category: ${option.category} Sub-Category: ${option.subcategory}`}
                                                    </p>
                                                ))}
                                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                                    <ShadowBox shadow="1" />
                                                </Grid>
                                            </Typography>
                                        )
                                    }
                                />
                            </ListItem>
                        </List>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [aval, setAval] = useState(false);
    const [waitmsg, setWaitmsg] = useState('Please Wait');
    const [open, setOpen] = useState(true);
    const [businesses, setBusinesses] = useState([]);

    const [error, setError] = useState('');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    };

    useEffect(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                setWaitmsg('Starting Business Fetch');
                await axios.get(`/api/private/getuserbusinesses`, config).then((response) => {
                    setBusinesses(response.data.data);
                });
                setWaitmsg('Done Fetching User Businesses');

                setOpen(false);
            } catch (error) {
                setWaitmsg(error.message);
                setError(error.message);
            }
        };

        getData();
    }, []);

    const handleClose = () => {
        setWaitmsg('Try going back⏱ or check your network🔌');
    };

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder'
    ];

    return aval ? (
        <Grid container spacing={gridSpacing}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
                <Typography sx={{ m: 4 }}>{waitmsg}</Typography>
            </Backdrop>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Businesses isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard isLoading={isLoading} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    ) : (
        <Grid container spacing={gridSpacing}>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
                <CircularProgress color="inherit" />
                <Typography sx={{ m: 4 }}>{waitmsg}</Typography>
            </Backdrop>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                        <NoBusinessLightCard isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={12} xs={12} md={12} lg={12}>
                        <BusinessCard isLoading={isLoading} names={names} />
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <AddBusiness isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
