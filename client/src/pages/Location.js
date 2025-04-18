import React from 'react';
import { Container, Grid, Typography, Paper, Box, Button, Card, CardContent, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';

const Location = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Besuchen Sie uns
      </Typography>
      <Typography variant="h5" component="h2" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Wir freuen uns auf Ihren Besuch in unserem Salon
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Kontakt & Öffnungszeiten
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography>
                Musterstraße 123<br />
                10115 Berlin
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography>
                030 12345678
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography>
                info@lockenroll.de
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h4" gutterBottom sx={{ mt: 4 }}>
              Öffnungszeiten
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
              <Box>
                <Typography component="div" variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Montag-Freitag:</strong> 9:00 - 19:00 Uhr
                </Typography>
                <Typography component="div" variant="body1" sx={{ mb: 0.5 }}>
                  <strong>Samstag:</strong> 9:00 - 16:00 Uhr
                </Typography>
                <Typography component="div" variant="body1">
                  <strong>Sonntag:</strong> Geschlossen
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Anfahrt
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {/* Placeholder für Google Maps */}
            <Box
              sx={{
                width: '100%',
                height: '250px',
                bgcolor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Typography color="text.secondary">
                Kartenansicht
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h4" gutterBottom>
              So erreichen Sie uns
            </Typography>
            
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <DirectionsTransitIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Mit öffentlichen Verkehrsmitteln
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      U-Bahn: Linie U2, Haltestelle Musterplatz<br />
                      Bus: Linien 120, 245, Haltestelle Musterstraße
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
            
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <DirectionsCarIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Mit dem Auto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Parkmöglichkeiten finden Sie in der Tiefgarage Musterplatz (2 Minuten Fußweg)<br />
                      Kostenpflichtige Parkplätze stehen auch direkt vor dem Salon zur Verfügung.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button 
          variant="contained" 
          size="large" 
          color="primary" 
          href="/appointment"
        >
          Jetzt Termin vereinbaren
        </Button>
      </Box>
    </Container>
  );
};

export default Location; 