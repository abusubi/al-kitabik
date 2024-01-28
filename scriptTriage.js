document.addEventListener('DOMContentLoaded', function() {

    // Create Surah and Verse Dropdowns
    chaptersData(); // COLLECT VERSE JSON AND FILL HTML SURAH DROPDOWN
    outputVerseData();
    verseNumber();

    // Output to HTML Row: Current Verse
    outputAyah();
    syncVerseNav(); // initial verse nav sync

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
        syncVerseNav(); // sync verse nav

    });

    // ------ Optional: Next and Prev Verse Buttons ------
document.querySelector('.btnVerseNext').addEventListener('click', function() {
    updateSelectIndex('next');
});

document.querySelector('.btnVersePrev').addEventListener('click', function() {
    updateSelectIndex('prev');
});

document.querySelector('.btnVerseNext2').addEventListener('click', function() {
    updateSelectIndex('next');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Smooth scroll to the top
});

document.querySelector('.btnVersePrev2').addEventListener('click', function() {
    updateSelectIndex('prev');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Smooth scroll to the top
});

function updateSelectIndex(direction) {
    let selectAyah = document.getElementById('id_selectAyah');
    let selectAyahFooter = document.getElementById('id_selectAyahFooter');

    let newIndex = selectAyah.selectedIndex;
    if (direction === 'next' && newIndex < selectAyah.options.length - 1) {
        newIndex++;
    } else if (direction === 'prev' && newIndex > 0) {
        newIndex--;
    }

    // Update both selects
    selectAyah.selectedIndex = newIndex;
    selectAyahFooter.selectedIndex = newIndex;

    // Update verseID
    verseID = parseInt(selectAyah.options[newIndex].value);

    // Update the current ayah and other related functions
    outputAyah();
    verseNumber(); // Update verseID
    trueRootSet(); // Find true root and set cardRow
}


    // // ------ Optional: Next and Prev Verse Buttons ------
    // document.querySelector('.btnVerseNext').addEventListener('click', function() {
    //     // Get the select element
    //     let select = document.getElementById('id_selectAyah');
    
    //     // Check if the next option exists
    //     if (select.selectedIndex < select.options.length - 1) {
    //         // Select the next option
    //         select.selectedIndex++;
    
    //         // Update verseID
    //         verseID = parseInt(select.options[select.selectedIndex].value);
    
    //         // Update the current ayah
    //         outputAyah();
    //         verseNumber(); // Update verseID
    //         trueRootSet(); // find true root and set cardRow
    //     }
    // });
    // document.querySelector('.btnVersePrev').addEventListener('click', function() {
    //     // Get the select element
    //     let select = document.getElementById('id_selectAyah');
    
    //     // Check if the next option exists
    //     if (select.selectedIndex < select.options.length) {
    //         // Select the next option
    //         select.selectedIndex--;
    
    //         // Update verseID
    //         verseID = parseInt(select.options[select.selectedIndex].value);
    
    //         // Update the current ayah
    //         outputAyah();
    //         verseNumber(); // Update verseID
    //         trueRootSet(); // find true root and set cardRow
    //     }
    // });
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
        const selectMenu = document.getElementById('id_selectSurah');
        // Clear the existing options
        selectMenu.innerHTML = ''; // Replace with your select element's ID
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


// 02. DECLARE INITIAL SURAHID VARIABLE
var surahID = 1; // Declare surahID at the top level so it's accessible in other functions

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


// 03. ITERATE THROUGH AYAS LIST, BASED ON A SPECIFIC SURAHID, AND OUTPUT AS AN AYAH DROPDOWN
// const versesURL = `/data/chapterVerses/${surahID}.json`;

// Fetch the chapters data
// function outputVerseData() {
//     fetch(`/data/chapterVerses/${surahID}.json`)
//         .then(response => response.json())
//         .then(data => {
//             // Ensure that 'data' property exists and is an array before proceeding
//             // if (data && Array.isArray(data.data)) {
//                 // Get the select element

//                 let select = document.getElementById('id_selectAyah');

//                 // Clear the existing options
//                 select.innerHTML = '';

//                 // To iterate over the items in the 'data' array
//                 data.data.forEach(item => {
//                     // Create a new option element
//                     let option = document.createElement('option');

//                     // Set the text and value of the option
//                     option.textContent = 'Verse ' + item.aya; // the .aya variable is from GET chapter-surah, API. eg the GET output.
//                     option.value = item.aya;

//                     // Append the option to the select element
//                     select.appendChild(option);
//                 });
//             }
//         // }
//         )
//         .catch(error => console.error('Error:', error));
//         console.log("versesGot")
// }


function outputVerseData() {
    fetch(`/data/chapterVerses/${surahID}.json`)
        .then(response => response.json())
        .then(data => {
            // Ensure that 'data' property exists and is an array before proceeding
            if (data && Array.isArray(data.data)) {
                // Populate both select elements
                populateSelectElement('id_selectAyah', data.data);
                populateSelectElement('id_selectAyahFooter', data.data);
            }
        })
        .catch(error => console.error('Error:', error));
    console.log("versesGot");
}

function populateSelectElement(selectElementId, dataArray) {
    let select = document.getElementById(selectElementId);

    // Clear the existing options
    select.innerHTML = '';

    // To iterate over the items in the dataArray
    dataArray.forEach(item => {
        // Create a new option element
        let option = document.createElement('option');

        // Set the text and value of the option
        option.textContent = 'Verse ' + item.aya; // the .aya variable is from GET chapter-surah, API. eg the GET output.
        option.value = item.aya;

        // Append the option to the select element
        select.appendChild(option);
    });
}





// GRAB AND SET VERSE NUMBER
var verseID = 1; // Declare verseID at the top level so it's accessible in other functions

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
    if (!selectElement || selectElement.options.length === 0 || selectElement.selectedIndex === -1) {
        return; // Exit the function if the select element is not properly defined
    }
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
    selectElement.style.width = `${width + 55}px`;


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
console.log("resized dropdown");
}
adjustSelectMenu();

// 04. OUTPUT AYAH IN HTML

function outputAyah() {
    // Ensure verseID is defined and is a number
    if (typeof verseID === 'undefined' || typeof verseID !== 'number') {
        console.error('Error: verseID is not defined or not a number');
        return;
    }

    fetch(`/data/chapterVerses/${surahID}.json`)
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
async function trueRootSet() {
    truerootID = getTrueRootId(surahID, (verseID + 1));
    console.log("True Root ID = " + truerootID); // This will log the truerootid or null if no match is found

    // run verse-root GET
    async function consoleVerseRootGET() {
        try {
            const response = await fetch(`/data/verseRoots/${truerootID}.json`);
            const data = await response.json();
            console.log(data); // Log the data to inspect its structure

            let rowCard = document.getElementById('id_rowCard');
            rowCard.innerHTML = '';

            data.data.forEach(item => {
                console.log(item);
                let div = document.createElement('div');
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
                rowCard.appendChild(div);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    await consoleVerseRootGET();
    console.log("innerHTML_update");
    runClickClassGetter(); // Call this function after the innerHTML has been updated
}


// Example usage
// function trueRootSet() {
//     truerootID = getTrueRootId(surahID, (verseID + 1));
//     console.log("True Root ID = " + truerootID); // This will log the truerootid or null if no match is found

    
//     // run verse-root GET
//     function consoleVerseRootGET() {
//         fetch(`/data/verseRoots/${truerootID}.json`)
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data); // Log the data to inspect its structure

//                 // Ensure that 'data' property exists and is an array before proceeding
//                 // if (data && Array.isArray(data.data)) {
//                     // Get the div element with the id 'id_rowCard'
//                     let rowCard = document.getElementById('id_rowCard');

//                     // Clear the previous div elements
//                     rowCard.innerHTML = '';

//                     // To iterate over the items in the 'data' array
//                     data.data.forEach(item => {
//                         console.log(item);

//                         // Create a new div element
//                         let div = document.createElement('div');

//                         // Set the text of the div element
//                         div.innerHTML = `
//                             <div class="singleCard">
//                                 <div class="cardRowTop">
//                                     <div class="clickWord"><span class="spanWord">${item.word}</span></div>
//                                     <div class="clickRoot"><span class="spanRoot">${item.rootword}</span></div>
//                                 </div>
//                                 <div class="cardRowBot">
//                                     <div class="clickMeaning">
//                                         <span class="spanMeaning">${item.meanings}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         `;

//                         // Append the div element to the 'id_rowCard' div
//                         rowCard.appendChild(div);
//                     });
//                 // }
//             })
//             .catch(error => console.error('Error:', error));
//     }

//     consoleVerseRootGET();
//     console.log("innerHTML_update");
//     setTimeout(runClickClassGetter, 1500); // note: need some delay
// }

// Click-Visibility Interaction

function runClickClassGetter() {

    // Get all div elements with the class 'clickWord'
    let clickWords = document.querySelectorAll('.clickWord, .clickWordHidden');
    // Add an event listener to each div element
    clickWords.forEach(clickWord => {
        clickWord.addEventListener('click', function(event) {
            // Check if the clicked element has a specific class
            if (this.classList.contains('clickWord')) {
                // Behavior for clickWord
                this.classList.toggle('clickWord');
                this.classList.toggle('clickWordHidden');
            } else if (this.classList.contains('clickWordHidden')) {
                // Behavior for clickWordHidden
                this.classList.toggle('clickWordHidden');
                this.classList.toggle('clickWord');
            }
    
            // Common behavior for both, if needed
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanWordHidden');
                span.classList.toggle('spanWord');
            }
        });
    });
    
    // Get all div elements with the class 'clickMeaning'
    let clickMeanings = document.querySelectorAll('.clickMeaning, .clickMeaningHidden');
    // Add an event listener to each div element
    clickMeanings.forEach(clickMeaning => {
        clickMeaning.addEventListener('click', function(event) {
            // Check if the clicked element has a specific class
            if (this.classList.contains('clickMeaning')) {
                // Behavior for clickMeaning
                this.classList.toggle('clickMeaning');
                this.classList.toggle('clickMeaningHidden');
            } else if (this.classList.contains('clickMeaningHidden')) {
                // Behavior for clickMeaningHidden
                this.classList.toggle('clickMeaningHidden');
                this.classList.toggle('clickMeaning');
            }
    
            // Common behavior for both, if needed
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanMeaningHidden');
                span.classList.toggle('spanMeaning');
            }
        });
    });

    // Get all div elements with the class 'clickMeaning'
    let clickRoots = document.querySelectorAll('.clickRoot, .clickRootHidden');
    // Add an event listener to each div element
    clickRoots.forEach(clickRoot => {
        clickRoot.addEventListener('click', function(event) {
            // Check if the clicked element has a specific class
            if (this.classList.contains('clickRoot')) {
                // Behavior for clickRoot
                this.classList.toggle('clickRoot');
                this.classList.toggle('clickRootHidden');
            } else if (this.classList.contains('clickRootHidden')) {
                // Behavior for clickRootHidden
                this.classList.toggle('clickRootHidden');
                this.classList.toggle('clickRoot');
            }
    
            // Common behavior for both, if needed
            let span = this.querySelector('span');
            if (span) {
                span.classList.toggle('spanRootHidden');
                span.classList.toggle('spanRoot');
            }
        });
    });

    console.log("Confirmation: classGot")
}

window.onload = function() {
    setTimeout(runClickClassGetter, 1500) // note: no delay needed.
}

// verse nav sync

function syncVerseNav() {

document.getElementById('id_selectAyah').addEventListener('change', function() {
    document.getElementById('id_selectAyahFooter').value = this.value;
  });
  
  document.getElementById('id_selectAyahFooter').addEventListener('change', function() {
    document.getElementById('id_selectAyah').value = this.value;
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); // Smooth scroll to the top
  });

}

