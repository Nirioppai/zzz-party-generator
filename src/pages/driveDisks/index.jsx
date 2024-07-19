import React, { useEffect, useState } from 'react';
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
  Button,
} from '@mui/material';
import charactersData from '../../assets/characters.json';
import {
  charactersState,
  searchTermState,
  teamsState,
  currentTeamState,
  numberOfTeamsState,
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

const calculateDriveDisks = teams => {
  const diskCounts = {};

  teams.forEach(team => {
    team.forEach(char => {
      diskCounts[char.fourPieceDriveDisk] =
        (diskCounts[char.fourPieceDriveDisk] || 0) + 4;
      diskCounts[char.twoPieceDriveDisk] =
        (diskCounts[char.twoPieceDriveDisk] || 0) + 2;
    });
  });

  // Sort the diskCounts object by value (count) in descending order
  const sortedDiskCounts = Object.entries(diskCounts)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  return sortedDiskCounts;
};

const TeamSelectionPage = () => {
  const [characters, setCharacters] = useRecoilState(charactersState);
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
  const [teams, setTeams] = useRecoilState(teamsState);
  const [currentTeam, setCurrentTeam] = useRecoilState(currentTeamState);
  const [numberOfTeams, setNumberOfTeams] = useRecoilState(numberOfTeamsState);
  const filteredCharacters = useRecoilValue(filteredCharactersSelector);
  const [selectionComplete, setSelectionComplete] = useState(false);

  useEffect(() => {
    setCharacters(charactersData);
  }, [setCharacters]);

  const handleAgentClick = agent => {
    if (currentTeam.length < 3) {
      setCurrentTeam(prevTeam => [...prevTeam, agent]);
    }
  };

  const handleTeamSubmit = () => {
    if (currentTeam.length === 3) {
      setTeams(prevTeams => [...prevTeams, currentTeam]);
      setCurrentTeam([]);
      if (teams.length + 1 === numberOfTeams) {
        setSelectionComplete(true);
      }
    }
  };

  const handleNumberOfTeamsChange = event => {
    const value = parseInt(event.target.value);
    setNumberOfTeams(value > 0 ? value : 1);
    setTeams([]);
    setCurrentTeam([]);
    setSelectionComplete(false);
  };

  const handleClearTeams = () => {
    setTeams([]);
    setCurrentTeam([]);
    setSelectionComplete(false);
  };

  return (
    <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
      <Typography variant='h4' gutterBottom>
        Team Selection
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          type='number'
          label='Number of Teams'
          value={numberOfTeams}
          onChange={handleNumberOfTeamsChange}
          inputProps={{ min: 1 }}
        />
      </Box>

      {!selectionComplete && (
        <>
          <Alert variant='filled' severity='info' sx={{ mb: 2 }}>
            Select 3 agents for each team. You are currently selecting Team{' '}
            {teams.length + 1} of {numberOfTeams}.
          </Alert>

          <TextField
            fullWidth
            variant='outlined'
            placeholder='Search agents...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant='body1'>
              Current Team: {currentTeam.map(agent => agent.Agent).join(', ')}
            </Typography>
            <Button
              variant='contained'
              onClick={handleTeamSubmit}
              disabled={currentTeam.length !== 3}
              sx={{ mr: 2 }}
            >
              Submit Team
            </Button>
            <Button
              variant='outlined'
              onClick={handleClearTeams}
              color='secondary'
            >
              Clear All Teams
            </Button>
          </Box>

          <Grid container spacing={4}>
            {filteredCharacters.map(char => (
              <Grid item key={char.Agent} xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardActionArea
                    onClick={() => handleAgentClick(char)}
                    disabled={currentTeam.length >= 3}
                  >
                    <CardMedia
                      component='img'
                      sx={{
                        height: 200,
                        objectFit: 'cover',
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
        </>
      )}

      {selectionComplete && (
        <>
          <Box>
            <Typography variant='h5' gutterBottom>
              Selected Teams
            </Typography>
            <Button
              variant='outlined'
              onClick={handleClearTeams}
              color='secondary'
              sx={{ mb: 2 }}
            >
              Clear All Teams
            </Button>
            {teams.map((team, teamIndex) => (
              <Box key={teamIndex} sx={{ mb: 4 }}>
                <Typography variant='h6' gutterBottom>
                  Team {teamIndex + 1}
                </Typography>
                <Grid container spacing={2}>
                  {team.map((char, charIndex) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={charIndex}>
                      <Card>
                        <CardMedia
                          component='img'
                          height='140'
                          image={char.imgUrl}
                          alt={char.Agent}
                          sx={{
                            objectFit: 'cover',
                          }}
                        />
                        <CardContent>
                          <Typography variant='body1'>{char.Agent}</Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {char.Attribute} - {char.Specialty}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            {char.Faction} - Tier {char.Tier}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            4 Piece Drive Disk - {char.fourPieceDriveDisk}
                          </Typography>
                          <Typography variant='body2' color='text.secondary'>
                            2 Piece Drive Disk - {char.twoPieceDriveDisk}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant='h5' gutterBottom>
              Drive Disks Summary
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(calculateDriveDisks(teams)).map(
                ([disk, count]) => (
                  <Grid item xs={12} sm={6} md={4} key={disk}>
                    <Card>
                      <CardContent>
                        <Typography variant='h6'>{disk}</Typography>
                        <Typography variant='body1'>Needed: {count}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Box>
        </>
      )}

      {filteredCharacters.length === 0 && (
        <Alert variant='filled' severity='error' sx={{ mt: 2 }}>
          No agents found matching your search criteria. Try adjusting your
          search terms.
        </Alert>
      )}
    </Container>
  );
};

export default TeamSelectionPage;
