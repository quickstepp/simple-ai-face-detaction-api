import {ClarifaiStub, grpc} from 'clarifai-nodejs-grpc';

const PAT = '75606b9cb3be45308c8b99edcbf3b892';
const USER_ID = 'quickstepp';
const APP_ID = 'my-first-application';
const MODEL_ID = 'face-detection';

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = () => (req, res) => {
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            inputs: [ { data: { image: { url: req.body.input, allow_duplicate_url: true } } } ]
        },
        metadata,
        (err, data) => {
            if (err) {
                throw new Error(err);
            }
    
            if (data.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + data.status.description);
            }
            
            res.json(data);
        }
    )
}

const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    let found = false ;

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries.'));
}

export {handleApiCall, handleImage};