document.addEventListener('DOMContentLoaded', function() {

    // Create Surah and Verse Dropdowns
    chaptersData(); // COLLECT VERSE JSON AND FILL HTML SURAH DROPDOWN
    outputVerseData();
    verseNumber();

    // Output to HTML Row: Current Verse
    outputAyah();

    // Event Listeners: Verse (Ayah) Selection, Surah Selection
    document.getElementById('id_selectAyah').addEventListener('change', function() {
        // surahNumber(); // Update surahID--- not necessary to update for verses.
        verseNumber(); // Update verseID
        outputAyah(); // Update Current Ayah
        trueRootSet(); // find true root and set cardRow
    });
    document.getElementById('id_selectSurah').addEventListener('change', function() {
        // Select the first option in the id_selectAyah dropdown
        document.getElementById('id_selectAyah').value = "1";
        surahNumber(); // Update surahID
        verseNumber(); // Update verseID
        outputVerseData(); // Update Verse Dropdown for Chapter <-> Verse
        outputAyah(); // Update Current Verse
        trueRootSet(); // find true root and set cardRow
    });

    // ------ Optional: Next and Prev Verse Buttons ------
    document.querySelector('.btnVerseNext').addEventListener('click', function() {
        // Get the select element
        let select = document.getElementById('id_selectAyah');
    
        // Check if the next option exists
        if (select.selectedIndex < select.options.length - 1) {
            // Select the next option
            select.selectedIndex++;
    
            // Update verseID
            verseID = parseInt(select.options[select.selectedIndex].value);
    
            // Update the current ayah
            outputAyah();
            verseNumber(); // Update verseID
            trueRootSet(); // find true root and set cardRow
        }
    });
    document.querySelector('.btnVersePrev').addEventListener('click', function() {
        // Get the select element
        let select = document.getElementById('id_selectAyah');
    
        // Check if the next option exists
        if (select.selectedIndex < select.options.length) {
            // Select the next option
            select.selectedIndex--;
    
            // Update verseID
            verseID = parseInt(select.options[select.selectedIndex].value);
    
            // Update the current ayah
            outputAyah();
            verseNumber(); // Update verseID
            trueRootSet(); // find true root and set cardRow
        }
    });
});

// 01. ACCESS CHAPTERS.JSON AND OUTPUT AS A SURAH DROPDOWN

// Assuming chapters.json is at a URL - replace 'URL_TO_CHAPTERS_JSON' with the actual URL
const chaptersUrl = '/data/chapters.json';

// Fetch the chapters data
function chaptersData() {
    fetch(chaptersUrl)
    .then(response => response.json())
    .then(data => {
        // Process the chapters data to create select options
        const selectMenu = document.getElementById('id_selectSurah'); // Replace with your select element's ID
        data.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.suranumber;
            option.text = `${chapter.suranumber}. ${chapter.suraname}`;
            selectMenu.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching the chapters data:', error);
    });
    console.log("chaptersGot")
}


// 02. DECLARE SURAHID VARIABLE
var surahID = 1; // Declare verseID at the top level so it's accessible in other functions

// GRAB AND SET SURAHID for SCRIPT DEPENDENCIES
function surahNumber() {
    // Select the dropdown element
    const select = document.getElementById('id_selectSurah');

    // Check if an option is selected
    if (select.selectedIndex !== -1) {
        // Get the selected option's value
        const selectedOptionValue = select.options[select.selectedIndex].value;

        // Parse the selected option's value to an integer and assign it to verseID
        surahID = parseInt(selectedOptionValue);
        // surahID = surahID_draft;

        // Log the verse number
        console.log('Current Surah: ' + surahID);
    } else {
        console.error('No option is selected');
    }
}


// ITERATE THROUGH AYAS LIST, BASED ON SURAHID, AND OUTPUT AS AN AYAH DROPDOWN
function outputVerseData() {
    fetch(`https://offlinequran.com:3001/api/chapter/${surahID}`)
        .then(response => response.json())
        .then(data => {
            // Ensure that 'data' property exists and is an array before proceeding
            if (data && Array.isArray(data.data)) {
                // Get the select element
                let select = document.getElementById('id_selectAyah');

                // Clear the existing options
                select.innerHTML = '';

                // To iterate over the items in the 'data' array
                data.data.forEach(item => {
                    // Create a new option element
                    let option = document.createElement('option');

                    // Set the text and value of the option
                    option.textContent = 'Verse ' + item.aya; // the .aya variable is from GET chapter-surah, API. eg the GET output.
                    option.value = item.aya;

                    // Append the option to the select element
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}





// GRAB AND SET VERSE NUMBER
let verseID; // Declare verseID at the top level so it's accessible in other functions

function verseNumber() {
    // Select the dropdown element
    const select = document.getElementById('id_selectAyah');

    // Check if an option is selected
    if (select.selectedIndex !== -1) {
        // Get the selected option's value
        const selectedOptionValue = select.options[select.selectedIndex].value;

        // Parse the selected option's value to an integer and assign it to verseID
        verseID_draft = parseInt(selectedOptionValue);
        verseID = verseID_draft - 1;

        // Log the verse number
        console.log('Current Verse: ' + (verseID));
    } else {
        console.error('No option is selected');
    }
}



// ––––– Dropdown Spacing Adjustment  –––––
function adjustSelectWidth(selectElement) {
    // Create a hidden span element to measure the text width
    let measurementSpan = document.createElement('span');
    measurementSpan.style.visibility = 'hidden';
    measurementSpan.style.position = 'absolute';
    measurementSpan.style.whiteSpace = 'nowrap';
    document.body.appendChild(measurementSpan);

    // Set the text of the span to the selected option's text
    measurementSpan.textContent = selectElement.options[selectElement.selectedIndex].text;

    // Measure the width
    let width = measurementSpan.offsetWidth;

    // Apply the width to the select element, adding some extra space for padding, border, etc.
    selectElement.style.width = `${width + 50}px`;

    // Remove the span element from the document
    document.body.removeChild(measurementSpan);
}

// Adjust width on page load and whenever the selection changes
function adjustSelectMenu() {
document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('id_selectSurah');
    adjustSelectWidth(selectElement);
    selectElement.addEventListener('change', () => adjustSelectWidth(selectElement));
});
}

// OUTPUT AYAH IN HTML
function outputAyah() {
    // Ensure verseID is defined and is a number
    if (typeof verseID === 'undefined' || typeof verseID !== 'number') {
        console.error('Error: verseID is not defined or not a number');
        return;
    }

    fetch(`https://offlinequran.com:3001/api/chapter/${surahID}`)
    .then(response => response.json())
    .then(data => {
        let container = document.getElementById('id_currentAyah');

        // Ensure that 'data' property exists and is an array before proceeding
        if (data && Array.isArray(data.data) && data.data.length > verseID) {
            // Get the item from the 'data' array based on verseID
            let item = data.data[verseID];
        
            // Assuming there is a span element inside the container that you want to update
            // If there is no span element, you might want to add one in your HTML
            let span = container.querySelector('span');
        
            // Check if the span exists
            if (span) {
                // Set the text content of the span to the new text
                span.textContent = item.text; // OUTPUTS AYAH VERSE
            } else {
                // If there is no span element, you can choose to create one or handle the error
                console.error('No span element found inside the container');
            }
        
        }
    })
    .catch(error => console.error('Error:', error));
}

// //OUTPUT LIST OF VERSES 
// function outputVerseList() {
//     // Ensure verseID is defined and is a number
//     if (typeof verseID === 'undefined' || typeof verseID !== 'number') {
//         console.error('Error: verseID is not defined or not a number');
//         return;
//     }

//     fetch(`https://offlinequran.com:3001/api/chapter/${surahID}`)
//     .then(response => response.json())
//     .then(data => {
//         let container = document.getElementById('surah-name');

//         // Ensure that 'data' property exists and is an array before proceeding
//         if (data && Array.isArray(data.data) && data.data.length) {
//             // Get the item from the 'data' array based on verseID
//             let item = data.data;

//             // Create a new div element
//             let div = document.createElement('div');

//             // Set its text content to the index of the item
//             div.textContent = 'Verse: ' + item.aya;

//             // Append the new div to the container
//             container.appendChild(div);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }


function fetchJSONData() {
    fetch("./data/rootIndex.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            //console.log(data);
            rootsData = data;
            console.log(rootsData);
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
}

fetchJSONData();




// Function to retrieve truerootid
function getTrueRootId(surahID, verseID) {
    const dataItem = rootsData.find(item => item.surah_id === surahID && item.verse_id === verseID);
    return dataItem ? dataItem.trueroot_id : null;
}

// Example usage
function trueRootSet() {
    truerootID = getTrueRootId(surahID, (verseID + 1));
    console.log("True Root ID = " + truerootID); // This will log the truerootid or null if no match is found

    // run verse-root GET
    function consoleVerseRootGET() {
        fetch(`https://offlinequran.com:3001/api/verse/${truerootID}/sentences`)
            .then(response => response.json())
            .then(data => {
                console.log(data);// Log the data to inspect its structure
                // Ensure that 'data' property exists and is an array before proceeding
                if (data && Array.isArray(data.data)) {
                    // To iterate over the items in the 'data' array
                    data.data.forEach(item => {
                        console.log(item);
                       
                        if (data && Array.isArray(data.data)) {
                            // Get the div element with the id 'id_rowCard'
                            let rowCard = document.getElementById('id_rowCard');
                    
                            // Clear the previous div elements
                            rowCard.innerHTML = '';
                    
                            // To iterate over the items in the 'data' array
                            data.data.forEach(item => {
                                console.log(item);
                    
                                // Create a new div element
                                let div = document.createElement('div');
                    
                                // Set the text of the div element
                                div.innerHTML = `
                                <div class="singleCard">
                                <div class="cardRowTop">
                                    <div class="clickWord"><span class="spanWord">${item.word}</span></div>
                                    <div class="clickRoot"><span class="spanRoot">${item.rootword}</span></div>
                                </div>
                                <div class="cardRowBot">
                                    <div class="clickMeaning">
                                        <span class="spanMeaning">${item.meanings}</span>
                                    </div>
                                </div>
                                </div>
                            
                             
                                `;
                    //    Word: ${item.word},
                    //Root Word: ${item.rootword},
                    //Meaning: ${item.meanings}
                                // Append the div element to the 'id_rowCard' div
                                rowCard.appendChild(div);
                            });
                        }
                        })
                    
                }
            })
            .catch(error => console.error('Error:', error));
    }
    consoleVerseRootGET();
    console.log("innerHTML_update");
    setTimeout(runClickClassGetter, 1500); // Delay of 1 seconds
}

// Click-Visibility Interaction

function runClickClassGetter() {

    // Get all div elements with the class 'clickWord'
    let clickWords = document.querySelectorAll('.clickWord');

    // Add an event listener to each div element
    clickWords.forEach(clickWord => {
        clickWord.addEventListener('click', function(event) {
            // Stop the event from bubbling up
            event.stopPropagation();
    
            // Toggle the class of the clicked div between 'clickMeaning' and 'clickMeaningHidden'
            this.classList.toggle('clickWord');
            this.classList.toggle('clickWordHidden');
    
            // Toggle the class 'spanHidden' on the child span element
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanWordHidden');
                span.classList.toggle('spanWord');
            }
        });
    });

    // Get all div elements with the class 'clickRoot'
    let clickRoots = document.querySelectorAll('.clickRoot');

    // Add an event listener to each div element
    clickRoots.forEach(clickRoot => {
        clickRoot.addEventListener('click', function(event) {
            // Stop the event from bubbling up
            event.stopPropagation();
    
            // Toggle the class of the clicked div between 'clickMeaning' and 'clickMeaningHidden'
            this.classList.toggle('clickRoot');
            this.classList.toggle('clickRootHidden');
    
            // Toggle the class 'spanHidden' on the child span element
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanRootHidden');
                span.classList.toggle('spanRoot');
            }
        });
    });

    // Get all div elements with the class 'clickMeaning'
    let clickMeanings = document.querySelectorAll('.clickMeaning');

    clickMeanings.forEach(clickMeaning => {
        clickMeaning.addEventListener('click', function(event) {
            // Stop the event from bubbling up
            event.stopPropagation();
    
            // Toggle the class of the clicked div between 'clickMeaning' and 'clickMeaningHidden'
            this.classList.toggle('clickMeaning');
            this.classList.toggle('clickMeaningHidden');
    
            // Toggle the class 'spanHidden' on the child span element
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanMeaningHidden');
                span.classList.toggle('spanMeaning');
            }
        });
    });

    console.log("Confirmation: classGot")
}

window.onload = function() {
    setTimeout(runClickClassGetter, 1000); // Delay of 2 seconds
}

