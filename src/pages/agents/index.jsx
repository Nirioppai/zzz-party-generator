import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, selector } from 'recoil';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  CardActionArea,
  Alert,
  Box,
} from '@mui/material';
import charactersData from '../../assets/characters.json';
import {
  charactersState,
  searchTermState,
  myAgentsState,
} from '../../atoms/atoms';

const filteredCharactersSelector = selector({
  key: 'filteredCharactersSelector',
  get: ({ get }) => {
    const chars = get(charactersState);
    const term = get(searchTermState).toLowerCase();
    return chars.filter(
      char =>
        char.Agent.toLowerCase().includes(term) ||
        char.Attribute.toLowerCase().includes(term) ||
        char.Specialty.toLowerCase().includes(term) ||
        char.Faction.toLowerCase().includes(term)
    );
  },
});

const AgentsPage = () => {
  const [characters, setCharacters] = useRecoilState(charactersState);
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
  const [myAgents, setMyAgents] = useRecoilState(myAgentsState);
  const filteredCharacters = useRecoilValue(filteredCharactersSelector);

  useEffect(() => {
    setCharacters(charactersData);
  }, [setCharacters]);

  const handleAgentClick = agent => {
    setMyAgents(prevAgents => {
      const newAgents = prevAgents.includes(agent)
        ? prevAgents.filter(a => a !== agent)
        : [...prevAgents, agent];

      console.log('myAgents:', newAgents);
      return newAgents;
    });
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Alert variant='filled' severity='info' sx={{ mb: 2 }}>
        Welcome to the Agents Page! Here you can browse and select your team of
        agents. Use the search bar below to filter agents by their name,
        attribute, specialty, or faction. Click on an agent's card to add them
        to your collection or remove them.
      </Alert>

      <TextField
        fullWidth
        variant='outlined'
        placeholder='Search agents...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Selected agents will appear in full color, while unselected agents are
        greyed out.
      </Typography>

      <Box sx={{ mb: 2, mt: 2 }}>
        <Typography variant='body1'>
          Your collection - {myAgents.length} agent
          {myAgents.length > 1 ? <>(s)</> : <></>} selected:
        </Typography>
        <Alert
          variant='filled'
          severity={myAgents.length <= 0 ? 'warning' : 'success'}
          sx={{ mb: 2 }}
        >
          {myAgents.join(', ') || 'No agents selected yet.'}
        </Alert>
      </Box>

      <Grid container spacing={4}>
        {filteredCharacters.map(char => (
          <Grid item key={char.Agent} xs={12} sm={6} md={3}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardActionArea onClick={() => handleAgentClick(char.Agent)}>
                <CardMedia
                  component='img'
                  sx={{
                    height: 200,
                    objectFit: 'cover',
                    filter: myAgents.includes(char.Agent)
                      ? 'none'
                      : 'grayscale(100%)',
                    transition: 'filter 0.3s ease-in-out',
                  }}
                  image={char.imgUrl}
                  alt={char.Agent}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant='h5' component='h2'>
                    {char.Agent}
                  </Typography>
                  <Typography>Attribute: {char.Attribute}</Typography>
                  <Typography>Specialty: {char.Specialty}</Typography>
                  <Typography>Faction: {char.Faction}</Typography>
                  <Typography>Tier: {char.Tier}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredCharacters.length === 0 && (
        <Alert variant='filled' severity='error' sx={{ mt: 2 }}>
          No agents found matching your search criteria. Try adjusting your
          search terms.
        </Alert>
      )}
    </Container>
  );
};

export default AgentsPage;
