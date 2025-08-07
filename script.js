const modelViewer = document.querySelector("model-viewer");
const infoIcon = document.getElementById("info-icon");
const infoDisplay = document.getElementById("info-display");
const screenshotButton = document.getElementById("screenshot-button");
const toggleSkyboxButton = document.getElementById("toggle-skybox-button");
const skyboxPopup = document.getElementById("skybox-popup");
const closeBtn = document.getElementById("close-btn");
const closeBtnSetting = document.getElementById("close-btn-setting");
const audioIcon = document.getElementById("audio-icon");
const musicIcon = document.getElementById("music-icon");
const heartIcon = document.getElementById("heart-icon");
const settingIcon = document.getElementById("setting-icon");
const popupBg = document.getElementById("popup-bg");

// For Setting Feature
const textureContainer = document.getElementById("texture-container");
const metalnessSlider = document.getElementById("metalness");
const roughnessSlider = document.getElementById("roughness");
const metalnessValue = document.getElementById("metalness-value");
const roughnessValue = document.getElementById("roughness-value");

// Setting Feature
modelViewer.addEventListener("load", () => {
  let materials = modelViewer.model.materials;

  textureContainer.innerHTML = ""; // Clear previous checkboxes

  // Store default values of metalness & roughness for reset
  let defaultValues = materials.map(material => ({
    metallicFactor: material.pbrMetallicRoughness.metallicFactor,
    roughnessFactor: material.pbrMetallicRoughness.roughnessFactor
  }));

  // Dynamically generate checkboxes based on material count
  materials.forEach((material, index) => {
    let label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" class="texture-checkbox" value="${index}"> Texture ${index + 1}`;
    textureContainer.appendChild(label);
  });

  function getSelectedMaterials() {
    let selectedIndices = Array.from(document.querySelectorAll(".texture-checkbox:checked"))
      .map((cb) => parseInt(cb.value))
    return selectedIndices.map((index) => ({ material: materials[index], index }));
  }

  function updateSliders(selectedMaterials) {
    if (selectedMaterials.length === 0) {
      // Reset to default if nothing is selected
      metalnessSlider.value = 0.5;
      roughnessSlider.value = 0.5;
      metalnessValue.textContent = "0.5";
      roughnessValue.textContent = "0.5";
    } else {
      let material = selectedMaterials[0].material;
      metalnessSlider.value = material.pbrMetallicRoughness.metallicFactor;
      roughnessSlider.value = material.pbrMetallicRoughness.roughnessFactor;
      metalnessValue.textContent = material.pbrMetallicRoughness.metallicFactor;
      roughnessValue.textContent = material.pbrMetallicRoughness.roughnessFactor;
    }
  }

  // Checkbox Change Event (Handles Check + Uncheck)
  textureContainer.addEventListener("change", (event) => {
    let selectedMaterials = getSelectedMaterials();

    if (!event.target.checked) {
      // If unchecking, reset to original values
      let index = parseInt(event.target.value);
      materials[index].pbrMetallicRoughness.setMetallicFactor(defaultValues[index].metallicFactor);
      materials[index].pbrMetallicRoughness.setRoughnessFactor(defaultValues[index].roughnessFactor);
    }

    updateSliders(selectedMaterials);
  });

  // Metalness Slider Event
  metalnessSlider.addEventListener("input", (event) => {
    let selectedMaterials = getSelectedMaterials();
    selectedMaterials.forEach(({ material }) => {
      material.pbrMetallicRoughness.setMetallicFactor(parseFloat(event.target.value));
    });
    metalnessValue.textContent = event.target.value;
  });

  // Roughness Slider Event
  roughnessSlider.addEventListener("input", (event) => {
    let selectedMaterials = getSelectedMaterials();
    selectedMaterials.forEach(({ material }) => {
      material.pbrMetallicRoughness.setRoughnessFactor(parseFloat(event.target.value));
    });
    roughnessValue.textContent = event.target.value;
  });

  });

  // Show popup on settings button click
  settingIcon.addEventListener("click", () => {
    popupBg.style.display = "flex";
  });

  // Hide popup when clicking outside or pressing close button
  closeBtnSetting.addEventListener("click", () => {
    popupBg.style.display = "none";
  });

  popupBg.addEventListener("click", (event) => {
    if (event.target === popupBg) {
      popupBg.style.display = "none";
    }
  });

  // Update values dynamically
  document.getElementById("metalness").addEventListener("input", function () {
    document.getElementById("metalness-value").textContent = this.value;
  });

  document.getElementById("roughness").addEventListener("input", function () {
    document.getElementById("roughness-value").textContent = this.value;
  });

  // Store the loved state for each model in localStorage
  const lovedModels = JSON.parse(localStorage.getItem('lovedModels')) || {};
  let skyboxEnabled = false;
  let currentAudio = null; // Store the current audio object
  let isPlaying = false; // Track if audio is currently playing
  let currentMusicAudio = null;
  let isMusicPlaying = false;

  // Object storing tree names, descriptions, and audio sources
  const infoText = {
    "Joshua Tree": {
      title: "Joshua Tree",
      description: "• Twisted, spiky branches with dagger-like green leaves. \n• Can grow up to 40 feet (12 meters) tall.",
      audioSrc: "/audio/Joshuatree.mp3"
    },
    "Date Palm": {
      title: "Date Palm",
      description: "• The Date Palm produces sweet edible fruits called dates. \n• The tree can live and bear fruit for over 100 years.",
      audioSrc: "/audio/DatePalm.mp3"
    },
    "Blue Jacaranda": {
      title: "Blue Jacaranda",
      description: "• The tree has fern-like compound leaves that add ornamental value. \n• Its flowers attract bees and butterflies, supporting biodiversity.",
      audioSrc: "/audio/BlueJacaranda.mp3"
    },
    "Sour Orange": {
      title: "Orange Tree",
      description: "• Its fruit is very sour and bitter, not typically eaten raw. \n• Produces aromatic white blossoms used in perfumes and teas.",
      audioSrc: "/audio/OrangeTree.mp3"
    },
    "Red Horse Chestnut": {
      title: "Red Horse Chestnut",
      description: "• It blooms with striking red to pink flower clusters in spring. \n• It forms a dense, rounded crown, offering good shade.",
      audioSrc: "/audio/RedHorseChestnut.mp3"
    },
    "Hong Kong Orchid Tree": {
      title: "Hong Kong Orchid Tree",
      description: "• Grows up to 20–40 feet, making it suitable for urban landscapes. \n• It produces large, fragrant, orchid-like pink to purple flowers.",
      audioSrc: "/audio/HongKongOrchidTree.mp3"
    },
    "African Continental Baobab": {
      title: "African Continental Baobab",
      description: "• Distinctive thick, bottle-shaped trunk that stores water. \n• Used for food, medicine, shelter, and spiritual practices across Africa.",
      audioSrc: "/audio/AfricanContinentalBaobab.mp3"
    },
    "Dragon Tree": {
      title: "Dragon Tree",
      description: "• Features thick, arching, blue-green leaves that grow in rosettes. \n• Can live for hundreds of years, making it a focal tree.",
      audioSrc: "/audio/DragonTree.mp3"
    },
    "Butterfly Palm": {
      title: "Butterfly Palm",
      description: "• Grows in bunches with multiple slender yellow-green stems. \n• Helps filter indoor air and increases humidity naturally.",
      audioSrc: "/audio/ButterflyPalm.mp3"
    },
    "Common Fig Tree": {
      title: "Common Fig Tree",
      description: "• Produces sweet, nutrient-rich figs that can be eaten fresh or dried. \n• Used in traditional medicine and valued since ancient times.",
      audioSrc: "/audio/CommonFigTree.mp3"
    },
    "Cabbage Tree": {
      title: "Cabbage Tree",
      description: "• Has long, narrow leaves that grow in tufts at the top of the trunk. \n• Used traditionally by the Māori for food.",
      audioSrc: "/audio/CabbageTree.mp3"
    },
    "Chinese Hibiscus": {
      title: "Chinese Hibiscus",
      description: "• Produces large, vibrant blooms in red, pink, yellow, or orange. \n• Used in traditional remedies and cultural rituals in many regions.",
      audioSrc: "/audio/ChineseHibiscus.mp3"
    },
    "Japanese Sago Palm": {
      title: "Japanese Sago Palm",
      description: "• Has stiff, glossy, dark green leaves that grow in a rosette pattern. \n• Grows very slowly, making it ideal for long-term landscaping and pots.",
      audioSrc: "/audio/JapaneseSagoPalm.mp3"
    },
    "California Fan Palm": {
      title: "California Fan Palm",
      description: "• Grows up to 60–75 feet, with a thick, columnar trunk. \n• Well adapted to hot, dry, desert environments.",
      audioSrc: "/audio/CaliforniaFanPalm.mp3"
    },
    "Lemon Tree": {
      title: "Lemon Tree",
      description: "• Produces bright yellow lemons rich in vitamin C and antioxidants.  \n• Has small, white, sweet-smelling blossoms that attract pollinators.",
      audioSrc: "/audio/LemonTree.mp3"
    },
    "Mexican Orange Blossom": {
      title: "Mexican Orange Blossom",
      description: "• Produces sweetly scented, star-shaped white flowers in spring. \n• Keeps its glossy green leaves year-round, adding constant greenery.",
      audioSrc: "/audio/MexicanOrangeBlossom.mp3"
    }
  };

  let musicList = [
    "/music/music1.mp3",
    "/music/music2.mp3",
    "/music/music3.mp3",
    "/music/music4.mp3",
    "/music/music5.mp3",
    "/music/music6.mp3",
    "/music/music7.mp3",
    "/music/music8.mp3",
  ]

  // Music Feature
  musicIcon.addEventListener("click", () => {
    if (isMusicPlaying) {
      currentMusicAudio.pause();
      musicIcon.innerHTML = '<i class="fas fa-volume-off"></i>';
      isMusicPlaying = false;
    } else {
      // Always create a new audio instance when starting music
      let randomIndex = Math.floor(Math.random() * musicList.length);
      currentMusicAudio = new Audio(musicList[randomIndex]);
      currentMusicAudio.onended = () => {
        musicIcon.innerHTML = '<i class="fas fa-volume-off"></i>';
        isMusicPlaying = false;
        currentMusicAudio = null; // Reset after finishing
      };

      currentMusicAudio.play()
        .then(() => {
          musicIcon.innerHTML = '<i class="fas fa-volume-high"></i>';
          isMusicPlaying = true;
        })
        .catch(e => {
          console.error("Error playing music:", e);
          musicIcon.innerHTML = '<i class="fas fa-volume-off"></i>';
          isMusicPlaying = false;
          currentMusicAudio = null;
        });
    }
  });

  // Heart Icon: Toggle between default and red heart
  heartIcon.addEventListener("click", () => {
    const heart = heartIcon.querySelector("i");

    if (heart.style.color === "rgb(230, 15, 47)") { // Check if the heart is red
      heart.style.color = ""; // Remove red color to revert to default
    } else {
      heart.style.color = "#dc143c"; // Change the heart color to red
    }
  });

  // Store the current tree name
  let currentTreeName = "Joshua Tree";

  // Toggle info display with GSAP animation
  infoIcon.addEventListener("click", () => {
    if (infoDisplay.style.display === "none" || !infoDisplay.style.display) {
      infoDisplay.style.display = "block"; // Ensure it's visible for animation
      infoDisplay.innerHTML = `<h3 class='treename'>${infoText[currentTreeName].title}</h3><p class="carinfo">${infoText[currentTreeName].description}</p>`;
      gsap.fromTo(
        infoDisplay,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    } else {
      gsap.to(infoDisplay, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          infoDisplay.style.display = "none"; // Hide after animation
        }
      });
    }
  });

  // Benefits Feature
  audioIcon.addEventListener("click", () => {
    if (!currentTreeName || !infoText[currentTreeName]) return;
    if (!currentAudio) {
      currentAudio = new Audio(infoText[currentTreeName].audioSrc);
    }

    if (isPlaying) {
      currentAudio.pause();
      audioIcon.innerHTML = '<i class="fas fa-play"></i>';
      isPlaying = false;
    } else {
      currentAudio.play();
      audioIcon.innerHTML = '<i class="fas fa-pause"></i>';
      isPlaying = true;
    }

    // Update when the audio ends
    currentAudio.onended = () => {
      audioIcon.innerHTML = '<i class="fas fa-play"></i>';
      isPlaying = false;
    };
  })

  // Switch tree model and update info display
  window.switchSrc = (element, foldername, name, TreeName) => {
    const base = `/${foldername}/${name}`;
    modelViewer.src = base + ".glb";
    modelViewer.poster = base + ".png";
    modelViewer.iosSrc = base + ".usdz";
    
    // Update the tree name
    currentTreeName = TreeName;

    // Add heart icon dynamically and check if the model is loved
    addHeartIcon(name);

    // Update the audio source
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      isPlaying = false;
      audioIcon.innerHTML = '<i class="fas fa-play"></i>';
    }
    if (infoText[currentTreeName] && infoText[currentTreeName].audioSrc) {
      currentAudio = new Audio(infoText[currentTreeName].audioSrc);
      currentAudio.pause();
      audioIcon.innerHTML = '<i class="fas fa-play"></i>';
    }
    const slides = document.querySelectorAll(".slide");
    slides.forEach((slide) => slide.classList.remove("selected"));
    element.classList.add("selected");

    // If info is visible, animate update
    if (infoDisplay.style.display === "block") {
      gsap.to(infoDisplay, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        ease: "power1.in",
        onComplete: () => {
          infoDisplay.innerHTML = `<h3>${infoText[currentTreeName].title}</h3><p>${infoText[currentTreeName].description}</p>`;
          gsap.fromTo(
            infoDisplay,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: "power1.out" }
          );
        }
      });
    }
  };

  // Function to dynamically add the heart icon button and check if it's loved
  function addHeartIcon(modelName) {
    // Create heart icon button
    const heartIconButton = document.createElement("button");
    heartIconButton.id = "heart-icon";
    heartIconButton.classList.add("heart-button");
    heartIconButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;

    // Check if the model has been loved before
    if (lovedModels[modelName]) {
      heartIconButton.innerHTML = `<i class="fa-solid fa-heart" style="color: #e60f2f;"></i>`;
    }

    // Add event listener to toggle love status
    heartIconButton.addEventListener("click", () => {
      if (lovedModels[modelName]) {
        // Unlove the model
        lovedModels[modelName] = false;
        heartIconButton.innerHTML = `<i class="fa-solid fa-heart"></i>`;
      } else {
        // Love the model
        lovedModels[modelName] = true;
        heartIconButton.innerHTML = `<i class="fa-solid fa-heart" style="color: #e60f2f;"></i>`;
      }
      // Save the loved state to localStorage
      localStorage.setItem("lovedModels", JSON.stringify(lovedModels));
  });

  // Append heart icon below the info display
  const infoDisplay = document.getElementById("info-display");
  infoDisplay.parentNode.appendChild(heartIconButton); // Append below info display
  }

  // Handle screenshot functionality
  screenshotButton.addEventListener("click", () => {
    if (modelViewer.toDataURL) {
      const imageUrl = modelViewer.toDataURL('image/png'); // Capture the screenshot as a PNG
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = "Trees.png";
      link.click();
    } else {
      alert("Screenshot functionality is not supported by this model viewer.");
    }
  });

  // Show the skybox selection popup when button is clicked
  toggleSkyboxButton.addEventListener("click", () => {
    skyboxPopup.style.display = "block";
  });

  document.getElementById('skybox-container').addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG') {
      changeSkybox(event.target.src);
    }
  });

  function changeSkybox(skyboxImage) {
    if (skyboxEnabled) {
      modelViewer.removeAttribute("skybox-image");
      modelViewer.setAttribute("exposure", "1");
      skyboxEnabled = false;
      toggleSkyboxButton.innerHTML = '<i class="fas fa-image"></i>';
    } else {
      modelViewer.setAttribute("skybox-image", skyboxImage);
      modelViewer.setAttribute("exposure", "4");
      skyboxEnabled = true;
      toggleSkyboxButton.innerHTML = '<i class="fas fa-image"></i>';
    }
  }

  // Close skybox popup when the close button is clicked
  closeBtn.addEventListener("click", () => {
    skyboxPopup.style.display = "none";
  });