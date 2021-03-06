import React, { Component } from 'react'
import { Snackbar,IconButton, Tooltip, Box, Typography, Grid, Card,  CardContent, CircularProgress, Button, } from '@material-ui/core'
import { Shop,Close } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import { withRouter } from "react-router"
import axios from 'axios'



class RewardView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      reward: this.props.reward,
      user: this.props.user,
      isButtonClicked: false,
      isModalOpen: false,
      confirmClaim: false,
      openSnackbar: false,
      snackbarText: '',
    }
  }

  async componentDidMount() {
  }



  handleSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openSnackbar: !this.state.openSnackbar
    })
  }


  showMessage = (msg) => {
    this.setState({
      snackbarText: msg,
      openSnackbar: true
    })
  }

  goToConfirm = () => {
    if (this.state.user.rewardCoins < this.state.reward.cost) {
      this.showMessage('Not enough P Coins!')
      this.setState({
        confirmClaim: false,
      })
      return
    }
    if (this.state.reward.quantity === 0) {
      this.showMessage('Out of Stock!')
      this.setState({
        confirmClaim: false,
      })
      return
    }

    this.setState({
      confirmClaim: true
    })
  }
  goToBuy = () => {
    this.setState({
      confirmClaim: false
    })
  }

  buyItem = async () => {
    this.setState({
      isButtonClicked: true
    })
    try {


      if (!this.state.confirmClaim) {
        this.showMessage('Failed to Claim Reward!')
        this.setState({
          confirmClaim: false,
          isButtonClicked: false
        })
        return
      }
      const response = await axios.post('/api/claim_reward', { id: this.state.reward._id })
      if (!response.data.success) {
        this.showMessage('Failed to Claim Reward! Make sure you have enough P Coins!')
        this.setState({
          confirmClaim: false,
          isButtonClicked: false
        })
        return
      }
      let reward = this.state.reward
      reward.quantity -= 1
      this.setState({
        reward: reward
      })
      this.props.buyItemCallback(this.state.reward.cost)
      this.setState({
        confirmClaim: false,
        isButtonClicked: false
      })
    } catch (e) {
      this.showMessage('Failed to Claim Reward!')
      this.setState({
        confirmClaim: false,
        isButtonClicked: false
      })

    }
  }





  render() {
    if (this.state.isLoading)
      return (
        <Skeleton className='rectangleSkeleton' type='rect' />
      )
    if (this.state.notFound)
      return (
        <Card variant='outlined'>
          <CardContent>
            <Typography variant='caption' color='textSecondary'>This Reward may have been removed.</Typography>
          </CardContent>
        </Card>
      )
    return (

      <Card variant='outlined'>
        <CardContent>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <img src={this.state.reward.photo} alt={this.state.reward.name} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Typography variant='h6'>{this.state.reward.name}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='center' alignItems='center'>
              <Typography variant='caption' color='textSecondary'>{this.state.reward.quantity === 0 ? 'Out of Stock' : this.state.reward.quantity + ' Left'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='caption' color='textSecondary'>
                {this.state.reward.cost + ' P Coins'}
              </Typography>
              {
                this.state.reward.quantity === 0
                  ?
                  null
                  :
                  this.state.isButtonClicked
                    ?
                    <CircularProgress color='secondary' />
                    :
                    this.state.confirmClaim
                      ?
                      <Box display='flex' alignItems='center'>

                        <Button onClick={this.goToBuy} variant='contained' color="primary" style={{ marginRight: 5 }}>
                          Cancel
                        </Button>
                        <Button onClick={this.buyItem} variant='contained' color="secondary">
                          Confirm
                        </Button>
                      </Box>
                      :
                      <Tooltip title="Claim Gift Card" placement='bottom' onClick={this.goToConfirm}>
                        <IconButton >
                          <Shop />
                        </IconButton>
                      </Tooltip>
              }
            </Box>
          </Grid>
        </CardContent>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.openSnackbar}
          autoHideDuration={6000}
          onClose={this.handleSnackbar}
          message={this.state.snackbarText}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleSnackbar}>
                <Close fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />

      </Card>

    )
  }

}

export default withRouter(RewardView);