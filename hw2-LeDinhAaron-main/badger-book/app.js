/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
        let html = '<div class="row">';
        studs.forEach(stud => {
            html += buildStudentHtml(stud);
        });
        html += '</div>';
        return html;
   // return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {
    let html = `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">`;
	html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
    html += `<h3>${stud.major}</h3>`;
    if (stud.fromWisconsin === true) {
        html += `<p>${stud.name.first} ${stud.name.last} is taking ${stud.numCredits} credits and IS from 
        Wisconsin.</p>`;
    }
    else {
        html += `<p>${stud.name.first} ${stud.name.last} is taking ${stud.numCredits} credits and is NOT from 
        Wisconsin.</p>`;
    }
    //interests
    if (stud.interests.length > 0) {
        html += `<p>Interests (${stud.interests.length}):</p>`;
        html += `<ul>`;
        stud.interests.forEach(interest => {
            html += `<li>${interest}</li>`;
        });
        html += `</ul>`;
    } else {
        html += `<p>No interests specified.</p>`;
    }
    html += `</div>`
	return html;
}
function handleSearch(e) {
	e.preventDefault();
	// TODO
	// For Step 5, implement the rest of this function!

    const nameInputted = document.getElementById("search-name").value.toLowerCase().trim();
    const majorInputted = document.getElementById("search-major").value.toLowerCase().trim();
    const interestInputted = document.getElementById("search-interest").value.toLowerCase().trim();
  
    fetch("https://cs571.org/api/f23/hw2/students", {
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      },
    })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          return res.json();
        } else {
          throw new Error();
        }
      })

      .then((data) => {
        const filteredStudents = data.filter((student) => {
          const studentName = `${student.name.first} ${student.name.last}`.toLowerCase();
          const studentMajor = student.major.toLowerCase();
          const studentInterests = student.interests.map((interest) => interest.toLowerCase());
  
          const nameMatch = nameInputted === "" || studentName.includes(nameInputted);
          const majorMatch = majorInputted === "" || studentMajor.includes(majorInputted);
          const interestMatch = interestInputted === "" || studentInterests.some((interest) => interest.includes(interestInputted));
  
          return nameMatch && majorMatch && interestMatch;
        });
  
        const studentsHtml = buildStudentsHtml(filteredStudents);
  
        const studentsContainer = document.getElementById("students");
        studentsContainer.innerHTML = studentsHtml;
  
        const numResultsElement = document.getElementById("num-results");
        numResultsElement.innerText = `${filteredStudents.length}`;
      })
      .catch((err) => {
        console.error("Could not fetch student data.");
      });
  }

    document.getElementById("search-btn").addEventListener("click", handleSearch);



    // Fetch student data
    fetch("https://cs571.org/api/f23/hw2/students", {
        headers: {
            "X-CS571-ID": CS571.getBadgerId()
        }
    })
    .then(res => {
        if (res.status === 200 || res.status === 304) {
            return res.json()
        } else {
            throw new Error();
        }
    })
    .then(data => {
        console.log(data);

          // Build HTML for student names
          const studentsHtml = buildStudentsHtml(data);

          // Update the 'students' div with the HTML for student names
          const studentsContainer = document.getElementById("students");
          studentsContainer.innerHTML = studentsHtml;

		const numResultsElement = document.getElementById("num-results");
        numResultsElement.innerText = `${data.length}`;
    })
    .catch(err => {
        console.error("Could not fetch student data.")
    });

document.getElementById("search-btn").addEventListener("click", handleSearch);
