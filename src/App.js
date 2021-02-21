import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { useState, useEffect } from 'react';
import useStyles from './styles';

function App() {
  const classes = useStyles();
  const [fetching, setFetching] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(10000);

  useEffect(() => {
    if (fetching) {
      fetchData();
    }
  }, [fetching]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, [fetching]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/photos?_limit=10&_page=${currentPage}`
      );
      const data = await response.json();

      setPhotos([...photos, ...data]);
      setCurrentPage(prevState => prevState + 1);
      setTotalCount(response.headers.get(['x-total-count']));
    } catch (e) {
      console.error(e.message);
    } finally {
      setFetching(false);
    }
  };

  const scrollHandler = e => {
    const scrollHeight = e.target.documentElement.scrollHeight;
    const scrollTop = e.target.documentElement.scrollTop;
    const innerHeight = window.innerHeight;

    if (scrollHeight - (scrollTop + innerHeight) < 100 && photos.length < totalCount) {
      console.log('load more');
      setFetching(true);
    }
  };

  return (
    <Box className={classes.wrapper} pt={5} pb={15}>
      <CssBaseline />

      <Container maxWidth='sm'>
        <Box component={Grid} pb={5} container spacing={2}>
          {photos.map(photo => (
            <Grid item sm={6} key={photo.id}>
              <Card className={classes.card}>
                <CardActionArea className={classes.cardBody}>
                  <CardMedia
                    component='img'
                    alt={photo.title}
                    height='150'
                    image={photo.url}
                    title={photo.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h5' component='h2'>
                      {photo.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Typography variant='overline'>Id: {photo.id}</Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Box>

        {fetching && (
          <Box display='flex' justifyContent='center'>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
