
import React, { Component } from 'react';
import Layout from '../../components/layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes'; // also Link exists

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    // onSubmit handler.. pass it to the Form below
    onSubmit = async (event) => {
        event.preventDefault(); // Keep the browser from attempting to submit the form

        this.setState({ loading: true, errorMessage: '' }); // flag for button loading spinner

        // If an error occurs with either line below, we will capture the error
        // Then we can alert the user with the error
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0] // When inside the browser, Metamask will take care of the gas for us.. **
                });

            // Redirect user back to the index page
            Router.pushRoute('/');

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false }); // end loading spinner
    };


    render() {
        return (
            <Layout>
                <h3>Create a campaign!!</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>

                        <label>Minimum Contribution</label>

                        <Input
                            label='Wei'
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event => this.setState({ minimumContribution: event.target.value })}
                        />

                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>

            </Layout>
        );
    }

}

export default CampaignNew;
