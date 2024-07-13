// src/components/PartyGenerator/index.jsx

import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  Box,
  List,
  ListItem,
} from '@mui/material';
import charactersData from '../../assets/characters.json';

const attributes = [...new Set(charactersData.map(char => char.Attribute))];
const specialties = [...new Set(charactersData.map(char => char.Specialty))];

function PartyGenerator() {
  const [partyName, setPartyName] = useState('');
  const [teamType, setTeamType] = useState('normal');
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [generatedParties, setGeneratedParties] = useState([]);

  const handlePartyNameChange = event => {
    setPartyName(event.target.value);
  };

  const handleTeamTypeChange = event => {
    setTeamType(event.target.value);
    if (event.target.value === 'disorder') {
      setSelectedAttribute('');
    }
  };

  const handleAttributeChange = event => {
    setSelectedAttribute(event.target.value);
  };

  const handleSpecialtyChange = event => {
    const value = event.target.value;
    if (value.length <= 3) {
      setSelectedSpecialties(value);
    }
  };

  const isPartyUnique = (party, existingParties) => {
    return !existingParties.some(existingParty =>
      existingParty.members.every(member =>
        party.members.some(newMember => newMember.Agent === member.Agent)
      )
    );
  };

  const resetState = () => {
    setGeneratedParties([]);
  };

  const generateParty = () => {
    let eligibleCharacters = [...charactersData].filter(char => {
      if (
        selectedSpecialties.length > 0 &&
        !selectedSpecialties.includes(char.Specialty)
      ) {
        return false;
      }
      if (
        teamType === 'mono' &&
        selectedAttribute &&
        char.Attribute !== selectedAttribute
      ) {
        return false;
      }
      return true;
    });

    const parties = [];

    while (parties.length < 10 && eligibleCharacters.length >= 3) {
      let party = [];
      let remainingCharacters = [...eligibleCharacters];

      while (party.length < 3 && remainingCharacters.length > 0) {
        remainingCharacters.sort((a, b) => {
          if (a.Tier !== b.Tier) return a.Tier - b.Tier;
          const aHasSynergy = party.some(
            c => c.Faction === a.Faction || c.Attribute === a.Attribute
          );
          const bHasSynergy = party.some(
            c => c.Faction === b.Faction || c.Attribute === b.Attribute
          );
          return bHasSynergy - aHasSynergy;
        });

        let selectedIndex = -1;
        if (teamType === 'disorder') {
          selectedIndex = remainingCharacters.findIndex(
            char => !party.some(c => c.Attribute === char.Attribute)
          );
        } else if (teamType === 'mono') {
          selectedIndex = remainingCharacters.findIndex(
            char => char.Attribute === selectedAttribute
          );
        } else if (teamType === 'compromised') {
          const attributeCounts = party.reduce((counts, char) => {
            counts[char.Attribute] = (counts[char.Attribute] || 0) + 1;
            return counts;
          }, {});

          if (party.length < 2) {
            selectedIndex = 0;
          } else {
            const targetAttribute = Object.entries(attributeCounts).find(
              ([_, count]) => count === 2
            )?.[0];
            if (targetAttribute) {
              selectedIndex = remainingCharacters.findIndex(
                char => char.Attribute !== targetAttribute
              );
            } else {
              selectedIndex = remainingCharacters.findIndex(
                char => attributeCounts[char.Attribute]
              );
            }
          }
        } else {
          selectedIndex = 0;
        }

        if (selectedIndex !== -1) {
          party.push(remainingCharacters[selectedIndex]);
          remainingCharacters.splice(selectedIndex, 1);
        } else {
          break;
        }
      }

      if (party.length === 3) {
        const score = party.reduce((sum, char) => sum + (3 - char.Tier), 0);
        const newParty = { members: party, score };

        if (isPartyUnique(newParty, parties)) {
          parties.push(newParty);
        }
      }

      eligibleCharacters = eligibleCharacters.filter(
        char => !party.some(member => member.Agent === char.Agent)
      );
    }

    parties.sort((a, b) => b.score - a.score);
    setGeneratedParties(parties);
  };

  const handleGenerateParty = () => {
    console.log('Generating party:', {
      partyName,
      teamType,
      selectedAttribute,
      selectedSpecialties,
    });

    resetState();
    generateParty();
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
        <RadioGroup
          row
          value={teamType}
          onChange={handleTeamTypeChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value='disorder'
            control={<Radio />}
            label='Disorder Team (3 Different Attributes)'
          />
          <FormControlLabel
            value='mono'
            control={<Radio />}
            label='Mono Attribute Team (3 Same Attributes)'
          />
          <FormControlLabel
            value='compromised'
            control={<Radio />}
            label='Compromised Attribute Team (2 Same Attributes)'
          />
        </RadioGroup>
        {teamType !== 'disorder' && (
          <Select
            fullWidth
            value={selectedAttribute}
            onChange={handleAttributeChange}
            displayEmpty
            sx={{ mb: 2 }}
          >
            <MenuItem value=''>
              <em>Select an Attribute</em>
            </MenuItem>
            {attributes.map(attribute => (
              <MenuItem key={attribute} value={attribute}>
                {attribute}
              </MenuItem>
            ))}
          </Select>
        )}
        <Select
          fullWidth
          multiple
          value={selectedSpecialties}
          onChange={handleSpecialtyChange}
          renderValue={selected =>
            selected.length ? selected.join(', ') : 'Select Specialties'
          }
          displayEmpty
          sx={{ mb: 2 }}
        >
          <MenuItem disabled value=''>
            <em>Select up to 3 Specialties</em>
          </MenuItem>
          {specialties.map(specialty => (
            <MenuItem
              key={specialty}
              value={specialty}
              disabled={
                selectedSpecialties.length >= 3 &&
                !selectedSpecialties.includes(specialty)
              }
            >
              <Checkbox checked={selectedSpecialties.indexOf(specialty) > -1} />
              <ListItemText primary={specialty} />
            </MenuItem>
          ))}
        </Select>
        <Button
          variant='contained'
          color='primary'
          onClick={handleGenerateParty}
          sx={{ mt: 2, mb: 4 }}
        >
          Generate Party
        </Button>

        {generatedParties.length > 0 && (
          <Box>
            <Typography variant='h5' gutterBottom>
              Generated Parties
            </Typography>
            <List>
              {generatedParties.map((party, index) => (
                <ListItem key={index}>
                  <Typography>
                    Rank {index + 1} - Score: {party.score.toFixed(2)} -
                    {party.members
                      .map(
                        char =>
                          ` ${char.Agent} (${char.Attribute}, ${char.Specialty})`
                      )
                      .join(', ')}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default PartyGenerator;
