import * as tf from '@tensorflow/tfjs';

class Main {

  constructor() {
    // Initialize buttons
    this.newDigit = document.getElementById('predict-image');
    this.newDigit.onclick = () => this.updateInputTensor();
    this.randImg = document.getElementById('random-image');
    this.randImg.onclick = () => this.initialize_random_image();

    tf.loadModel('model2/model.json').then((model) => {
      this.model = model;
      
      document.getElementById("ready-trigger").innerHTML = "Model is Ready :)"
      this.random_image();
    });
  }

  random_image() {
    let randInt = Math.floor(Math.random() * 6) + 1;
    console.log(randInt)
    let temp_image = new Image();
    temp_image.src = "data/" + randInt + ".jpeg";
    document.getElementById("img").src = temp_image.src;
  }

  trigger_search(query) {
         var JSElement = document.createElement('script');
         JSElement.src = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyCUwXHx7yvicNW3tAI-NAu47cKjN_4LFZ8&cx=001792966700025164735:8xnzg1hpiuc&q='+query+'&callback=hndlr';
         document.getElementsByTagName('body')[0].appendChild(JSElement);
    }

  runmodel() {
    const limit = tf.tensor1d([0.5]);
    const prediction = this.model.predict(this.inputTensor.expandDims()).greaterEqual(limit);
    var obj = JSON.parse('{ "0":"Coco Martin", "1":"Piolo Pascual"}');

    const predictions = Array.from(prediction.dataSync());
    console.log(obj[predictions])
    document.getElementById("result").innerHTML = obj[predictions]
    this.trigger_search(obj[predictions])
  }

  updateInputTensor() {
    let temp = new Image();
    var youtubeimgsrc = document.getElementById("img").src
    temp.src = youtubeimgsrc;
    //resize the image
    temp.width = 160
    temp.height = 160
    temp.onload = () => {
      if (this.inputTensor) {
        this.inputTensor.dispose();
      }
      this.inputTensor = tf.tidy(() =>
        tf.fromPixels(temp).toFloat().div(tf.scalar(255))
      );
      this.runmodel();
    }
  }
}

window.addEventListener('load', () => new Main());

