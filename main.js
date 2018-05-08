import * as tf from '@tensorflow/tfjs';

/**
 * Main application to start on window load
 */
class Main {
  /**
   * Constructor creates and initializes the variables needed for
   * the application
   */
  constructor() {
    // Initialize random image
    this.initialize_random_image();
    // Initialize buttons
    this.newDigit = document.getElementById('predict-image');
    this.newDigit.onclick = () => this.updateInputTensor();
    this.randImg = document.getElementById('random-image');
    this.randImg.onclick = () => this.initialize_random_image();

    tf.loadModel('model2/model.json').then((model) => {
      this.model = model;
    });
  }

  /**
   * Called after model has finished loading or generating. 
   * Sets up UI elements.
   */
  initialize_random_image() {
    let randInt = Math.floor(Math.random() * 6) + 1;
    console.log(randInt)
    let temp_image = new Image();
    temp_image.src = "data/" + randInt + ".jpeg";
    document.getElementById("blah").src = temp_image.src;
  }

  triggersearch(query) {
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
    document.getElementById("demo").innerHTML = obj[predictions]
    this.triggersearch(obj[predictions])
  }


  updateInputTensor() {
    // TODO: Don't load this in immediately. Add it with noise.
    let temp = new Image();
    var youtubeimgsrc = document.getElementById("blah").src
    temp.src = youtubeimgsrc;
    temp.width = 160
    temp.height = 160
    temp.onload = () => {
      if (this.inputTensor) {
        this.inputTensor.dispose();
      }
      this.inputTensor = tf.tidy(() =>
        tf.fromPixels(temp).toFloat().div(tf.scalar(255))
      );
      //tf.toPixels(this.inputTensor, this.originalImg);
      this.runmodel();
    }
  }



}

window.addEventListener('load', () => new Main());

