import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
} from '@mui/material';

import characters from '../../assets/characters.json';

const attributes = ['Fire', 'Electric', 'Ice', 'Physical', 'Ether', 'Autofill'];
const specialties = [
  'Attack',
  'Support',
  'Stun',
  'Defense',
  'Anomaly',
  'Autofill',
];

function PartyGenerator() {
  const [partyName, setPartyName] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [generatedTeams, setGeneratedTeams] = useState([]);

  useEffect(() => {
    console.log('generatedTeams updated:', generatedTeams);
  }, [generatedTeams]);

  const handlePartyNameChange = event => {
    setPartyName(event.target.value);
  };

  const handleAttributeClick = attribute => {
    if (selectedAttributes.length < 3) {
      setSelectedAttributes([...selectedAttributes, attribute]);
    }
  };

  const handleSpecialtyClick = specialty => {
    if (selectedSpecialties.length < 3) {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const resetOptions = () => {
    setSelectedAttributes([]);
    setSelectedSpecialties([]);
    setGeneratedTeams([]);
  };

  const generateParty = () => {
    let filteredCharacters = characters;

    // Filter by attributes
    if (selectedAttributes.length > 0) {
      filteredCharacters = filteredCharacters.filter(
        char =>
          selectedAttributes.includes('Autofill') ||
          selectedAttributes.includes(char.Attribute)
      );
    }

    // Filter by specialties
    if (selectedSpecialties.length > 0) {
      filteredCharacters = filteredCharacters.filter(
        char =>
          selectedSpecialties.includes('Autofill') ||
          selectedSpecialties.includes(char.Specialty)
      );
    }

    // If we don't have enough characters, return empty array
    if (filteredCharacters.length < 3) {
      return [];
    }

    // Generate all possible combinations of 3 characters
    const combinations = getCombinations(filteredCharacters, 3);

    // Score each combination
    const scoredCombinations = combinations.map(combo => ({
      team: combo,
      score: scoreTeam(combo),
    }));

    // Sort by score (descending) and remove duplicates
    const uniqueTeams = removeDuplicates(
      scoredCombinations.sort((a, b) => b.score - a.score)
    );

    console.log('Unique teams generated:', uniqueTeams);
    return uniqueTeams;
  };

  const getCombinations = (array, size) => {
    const result = [];

    function backtrack(start, current) {
      if (current.length === size) {
        result.push([...current]);
        return;
      }

      for (let i = start; i < array.length; i++) {
        current.push(array[i]);
        backtrack(i + 1, current);
        current.pop();
      }
    }

    backtrack(0, []);
    return result;
  };

  const scoreTeam = team => {
    let score = 0;

    // Score based on tiers
    score += team.reduce((sum, char) => sum + (3 - char.Tier), 0);

    // Bonus for same faction
    const factions = team.map(char => char.Faction);
    if (new Set(factions).size < 3) score += 2;
    if (new Set(factions).size === 1) score += 3;

    // Bonus for same attribute
    const attributes = team.map(char => char.Attribute);
    if (new Set(attributes).size < 3) score += 2;
    if (new Set(attributes).size === 1) score += 3;

    return score;
  };

  const removeDuplicates = teams => {
    const seen = new Set();
    return teams.filter(item => {
      const key = item.team
        .map(char => char.Agent)
        .sort()
        .join(',');
      return seen.has(key) ? false : seen.add(key);
    });
  };

  const handleGenerateParty = () => {
    const teams = generateParty();
    setGeneratedTeams(teams);
    console.log('Generated teams:', teams);

    setPartyName('');
    setSelectedAttributes([]);
    setSelectedSpecialties([]);
  };

  return (
    <Container>
      <Typography variant='h4' gutterBottom>
        Welcome to New Eridu Party Generator!
      </Typography>
      <Box component='form' noValidate autoComplete='off'>
        <TextField
          fullWidth
          label='Party Name'
          value={partyName}
          onChange={handlePartyNameChange}
          margin='normal'
          sx={{ mb: 2 }}
        />

        <Typography variant='h6' gutterBottom>
          Attributes
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {attributes.map(attribute => (
            <Button
              key={attribute}
              variant='outlined'
              onClick={() => handleAttributeClick(attribute)}
              disabled={selectedAttributes.length >= 3}
            >
              {attribute}
            </Button>
          ))}
        </Box>

        <Typography variant='h6' gutterBottom>
          Specialties
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {specialties.map(specialty => (
            <Button
              key={specialty}
              variant='outlined'
              onClick={() => handleSpecialtyClick(specialty)}
              disabled={selectedSpecialties.length >= 3}
            >
              {specialty}
            </Button>
          ))}
        </Box>

        {selectedAttributes.length !== 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Selected Attributes:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedAttributes.map((attribute, index) => (
                <Chip
                  key={`${attribute}-${index}`}
                  label={attribute}
                  color='primary'
                />
              ))}
            </Box>
          </Box>
        )}

        {selectedSpecialties.length !== 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant='h6' gutterBottom>
              Selected Specialties:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedSpecialties.map((specialty, index) => (
                <Chip
                  key={`${specialty}-${index}`}
                  label={specialty}
                  color='secondary'
                />
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Button variant='outlined' onClick={resetOptions} sx={{ mr: 2 }}>
            Reset Options
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleGenerateParty}
          >
            Generate Party
          </Button>
        </Box>

        {generatedTeams.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant='h5' gutterBottom>
              Generated Teams:
            </Typography>
            {generatedTeams.map((teamData, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <Typography variant='h6'>
                  Team {index + 1} (Score: {teamData.score})
                </Typography>
                {teamData.team.map((char, charIndex) => (
                  <Typography key={charIndex} variant='body1'>
                    {char.Agent} - {char.Attribute} - {char.Specialty} -{' '}
                    {char.Faction} - Tier {char.Tier}
                  </Typography>
                ))}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default PartyGenerator;
