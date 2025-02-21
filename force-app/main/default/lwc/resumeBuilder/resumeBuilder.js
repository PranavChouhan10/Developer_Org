import { LightningElement, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import JS_PDF from '@salesforce/resourceUrl/jsPDF';
import saveResumeRecord from '@salesforce/apex/ResumePDFController.saveResumeRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const formats = [
    'bold',
    'italic',
    'list',
    'indent',
    'align',
    'clean',
    'header',
];

const graduationDegreeOptions = [
    { label: 'Bachelor of Arts (BA)', value: 'BA' },
    { label: 'Bachelor of Science (BSc)', value: 'BSc' },
    { label: 'Bachelor of Commerce (BCom)', value: 'BCom' },
    { label: 'Bachelor of Business Administration (BBA)', value: 'BBA' },
    { label: 'Bachelor of Engineering (BE)', value: 'BE' },
    { label: 'Bachelor of Technology (BTech)', value: 'BTech' },
    { label: 'Bachelor of Computer Applications (BCA)', value: 'BCA' },
    { label: 'Bachelor of Architecture (BArch)', value: 'BArch' },
    { label: 'Bachelor of Medicine, Bachelor of Surgery (MBBS)', value: 'MBBS' },
    { label: 'Bachelor of Dental Surgery (BDS)', value: 'BDS' },
    { label: 'Bachelor of Pharmacy (BPharm)', value: 'BPharm' },
    { label: 'Bachelor of Science in Nursing (BSc Nursing)', value: 'BScNursing' },
    { label: 'Bachelor of Law (LLB)', value: 'LLB' },
    { label: 'Bachelor of Education (BEd)', value: 'BEd' },
    { label: 'Bachelor of Fine Arts (BFA)', value: 'BFA' },
    { label: 'Bachelor of Design (BDes)', value: 'BDes' },
    { label: 'Bachelor of Hotel Management (BHM)', value: 'BHM' },
    { label: 'Bachelor of Journalism and Mass Communication (BJMC)', value: 'BJMC' },
    { label: 'Bachelor of Performing Arts (BPA)', value: 'BPA' },
    { label: 'Bachelor of Social Work (BSW)', value: 'BSW' },
    { label: 'Bachelor of Veterinary Science (BVSc)', value: 'BVSc' },
    { label: 'Bachelor of Agriculture (BSc Agriculture)', value: 'BScAgriculture' },
    { label: 'Bachelor of Physiotherapy (BPT)', value: 'BPT' },
    { label: 'Bachelor of Public Administration (BPA)', value: 'BPA' },
    { label: 'Bachelor of Management Studies (BMS)', value: 'BMS' },
];

const postGraduationDegreeOptions = [
    { label: 'Master of Arts (MA)', value: 'MA' },
    { label: 'Master of Science (MSc)', value: 'MSc' },
    { label: 'Master of Commerce (MCom)', value: 'MCom' },
    { label: 'Master of Business Administration (MBA)', value: 'MBA' },
    { label: 'Master of Technology (MTech)', value: 'MTech' },
    { label: 'Master of Computer Applications (MCA)', value: 'MCA' },
    { label: 'Master of Engineering (MEng)', value: 'MEng' },
    { label: 'Master of Fine Arts (MFA)', value: 'MFA' },
    { label: 'Master of Design (MDes)', value: 'MDes' },
    { label: 'Master of Education (MEd)', value: 'MEd' },
    { label: 'Master of Philosophy (MPhil)', value: 'MPhil' },
    { label: 'Master of Law (LLM)', value: 'LLM' },
    { label: 'Master of Public Administration (MPA)', value: 'MPA' },
    { label: 'Master of Health Administration (MHA)', value: 'MHA' },
    { label: 'Master of Social Work (MSW)', value: 'MSW' },
    { label: 'Master of Architecture (MArch)', value: 'MArch' },
    { label: 'Master of Business Management (MBM)', value: 'MBM' },
    { label: 'Master of Journalism and Mass Communication (MJMC)', value: 'MJMC' },
    { label: 'Master of Veterinary Science (MVSc)', value: 'MVSc' },
    { label: 'Master of Hospital Administration (MHA)', value: 'MHA' },
    { label: 'Master of Music (MMus)', value: 'MMus' },
    { label: 'Master of Science in Nursing (MSN)', value: 'MSN' },
    { label: 'Master of Library and Information Science (MLIS)', value: 'MLIS' },
    { label: 'Master of Arts in Education (MA Ed)', value: 'MAEd' },
    { label: 'Master of Tourism Administration (MTA)', value: 'MTA' }
];

const skillList = [
    "Salesforce Administrator",
    "Salesforce Developer",
    "Salesforce Architect",
    "Salesforce Consultant",
    "Salesforce Marketing Cloud",
    "Salesforce Service Cloud",
    "Salesforce Sales Cloud",
    "Salesforce Einstein Analytics",
    "Salesforce Integration",
    "Salesforce Apex",
    "Salesforce Lightning",
    "Salesforce Flow",
    "Salesforce LWC",
    "Salesforce Security",
    "Cloud Computing",
    "AWS Cloud Practitioner",
    "AWS Solutions Architect",
    "AWS Developer",
    "AWS SysOps Administrator",
    "Microsoft Azure",
    "Google Cloud Platform",
    "Cloud Security",
    "Cloud DevOps",
    "Cloud Architect",
    "Cloud Native Development",
    "Cloud Migration",
    "Cloud Storage",
    "Cloud Monitoring",
    "Cloud Backup",
    "Cloud Automation",
    "SaaS",
    "PaaS",
    "IaaS",
    "Kubernetes",
    "Docker",
    "Terraform",
    "Ansible",
    "CI/CD Pipelines",
    "Serverless Computing",
    "Big Data Analytics on Cloud",
    "Other",
];

export default class ResumeBuilder extends LightningElement {
    selectedItem = 'profile';
    showProfile = false;
    showSummary = false;
    showEducation = false;
    showExperience = false;
    showProjects = false;
    showSkills = false;
    showCertifications = false;
    showOverview = false;
    isShowModal = false;
    showButtons = false;
    expValidity = true;
    projValidity = true;

    showExpAddButton = true;
    showProjAddButton = true;
    showCertAddButton = true;

    formats = formats;
    graduationDegreeOptions = graduationDegreeOptions;
    postGraduationDegreeOptions = postGraduationDegreeOptions;
    skillList = skillList;

    seniorSecondaryMarks = false;
    graduationMarks = false;
    postGraduationMarks = false;

    @track profile = { firstname: '', lastname: '', email: '', phone: '', summary: '' };
    @track education = {
        seniorsecondaryInstitute: '',
        stream: '',
        seniorsecondaryPercentage: '',
        seniorsecondaryMarksType: 'Percentage',
        seniorsecondaryStartDate: '',
        seniorsecondaryEndDate: '',
    };
    @track graduationEducation = {
        graduationInstitute: '',
        graduationDegree: '',
        graduationBranch: '',
        graduationPercentage: '',
        graduationMarksType: 'Percentage',
        graduationStartDate: '',
        graduationEndDate: '',
        graduationPresent: false
    }
    @track postgraduationEducation = {
        postGraduationInstitute: '',
        postGraduationDegree: '',
        postGraduationbranch: '',
        postGraduationPercentage: '',
        postGraduationMarksType: 'Percentage',
        postGraduationStartDate: '',
        postGraduationEndDate: '',
        postGraduationPresent: false
    };
    @track experience = [];
    @track project = [];
    @track skills = [];
    @track certifications = [];

    currentDate;
    ispostGraduation = false;

    isGraduation = false; //

    imageUrl = 'https://cdn-icons-png.flaticon.com/128/9408/9408175.png';
    jsPDFInitialized = false;

    @track selectedSkill = '';
    @track otherSkill = '';
    @track pills = [];


    get options() {
        return [
            { label: 'Percentage', value: 'Percentage' },
            { label: 'CGPA', value: 'CGPA' },
        ];
    }

    get skillsOptions() {
        return this.skillList.map(skill => ({
            label: skill,
            value: skill
        }));
    }

    connectedCallback() {
        this.currentDate = new Date().toJSON().slice(0, 10);
        console.log(this.currentDate);
    }

    renderedCallback() {
        if (!this.jsPDFInitialized) {
            this.jsPDFInitialized = true;
            loadScript(this, JS_PDF)
                .then(() => {
                    console.log('jsPDF library loaded successfully');
                })
                .catch((error) => {
                    console.error('Error loading jsPDF library', error);
                });
        }
    }

    //=============================================
    handleGraduationCheckboxChange(event) {
        this.isGraduation = event.target.checked;
        console.log(this.isGraduation);
        console.log('Updated Education Object:', JSON.stringify(this.education, null, 2));
    }
    //=============================================

    handlepostGraduationCheckboxChange(event) {
        this.ispostGraduation = event.target.checked;
        console.log(this.ispostGraduation);
        if (this.ispostGraduation) {
            this.graduationEducation.graduationPresent = false;
            this.graduationEducation.graduationEndDate = '';

        }
        console.log('Updated Education Object:', JSON.stringify(this.education, null, 2));
    }

    handleSelect(event) {
        const selected = event.detail.name;
        this.selectedItem = selected;
        this.showProfile = selected === 'profile';
        this.showSummary = selected === 'summary';
        this.showEducation = selected === 'education';
        this.showExperience = selected === 'experience';
        this.showProjects = selected === 'projects'
        this.showSkills = selected === 'skills';
        this.showCertifications = selected === 'certifications';
        this.showOverview = selected === 'overview';
        if (this.showOverview) {
            this.showButtons = true;
            console.log('Overview');

        } else {
            this.showButtons = false;
        }
    }

    get indexedExperience() {
        return this.experience.map((exp, index) => ({
            ...exp,
            displayIndex: index + 1 // Adjust index to start from 1
        }));
    }

    addExperience() {


        if (this.experience != []) {
            console.log('if');

            this.showExpAddButton = false;
        } else {
            console.log('else');

            this.showExpAddButton = true;
        }
        const isAnyPresent = this.experience.some(exp => exp.present);
        if (this.experience.length < 4) {
            const newExp = {
                id: this.experience.length,
                company: '',
                role: '',
                from: '',
                to: '',
                summary: '',
                present: false,
                disablePresentCheckbox: isAnyPresent, // Disable if any experience is marked as present
            };
            this.experience = [...this.experience, newExp];
        }
        console.log(JSON.stringify(this.experience, null, 2)); d
    }

    get indexedProject() {
        return this.project.map((pro, index) => ({
            ...pro,
            displayIndex: index + 1 // Adjust index to start from 1
        }));
    }

    addProject() {
        if (this.project != []) {
            this.showProjAddButton = false;
        } else {
            this.showProjAddButton = true;
        }
        const isAnyPresent = this.project.some(exp => exp.present);
        if (this.project.length < 5) {
            const newPro = {
                id: this.project.length,
                projectName: '',
                summary: '',
                from: '',
                to: '',
                present: false,
                disablePresentCheckbox: isAnyPresent, // Disable if any experience is marked as present
            };
            this.project = [...this.project, newPro];
        }
    }

    addSkills() {
        if (this.selectedSkill == '') {
            this.showToast('Error', 'Please enter a valid skill.', 'error');
            return;
        }
        if (this.skills.length < 10) {
            if (this.selectedSkill === 'Other') {
                // Handle "Other" skill
                if (!this.otherSkill.trim()) {
                    this.showToast('Error', 'Please enter a valid skill.', 'error');
                    return;
                }
                if (this.pills.some(pill => pill.name.toLowerCase() === this.otherSkill.trim().toLowerCase())) {
                    this.showToast('Info', 'This skill is already added.', 'info');
                    return;
                }
                this.pills = [...this.pills, { label: this.otherSkill.trim(), name: this.otherSkill.trim() }];
                this.skills.push(this.otherSkill.trim());
                this.otherSkill = ''; // Reset the "Other" input
                console.log(JSON.stringify(this.skills, null, 2));

            } else if (this.selectedSkill) {
                // Handle predefined skills
                if (this.pills.some(pill => pill.name.toLowerCase() === this.selectedSkill.toLowerCase())) {
                    this.showToast('Info', 'This skill is already added.', 'info');
                    return;
                }
                this.pills = [...this.pills, { label: this.selectedSkill, name: this.selectedSkill }];
                this.skills.push(this.selectedSkill);
                console.log(JSON.stringify(this.skills, null, 2));

            }
            this.showToast('Success', 'New skill added.', 'Success');
            console.log(JSON.stringify(this.pills));
            console.log('skills', JSON.stringify(this.skills, null, 2));
        }
    }

    get isOtherSkillSelected() {
        return this.selectedSkill === 'Other';
    }

    handleSkillChange(event) {
        this.selectedSkill = event.target.value;
    }

    removePill(event) {
        const name = event.detail.item.name;
        this.showToast('Success', `${name} skill was removed!`, 'success');
        const index = event.detail.index;
        this.pills.splice(index, 1);
        this.skills.splice(index, 1);
        console.log('skills', JSON.stringify(this.skills, null, 2));
    }

    // Handle input change for "Other" skill
    handleOtherSkillChange(event) {
        this.otherSkill = event.target.value;
    }

    get indexedCertification() {
        return this.certifications.map((cert, index) => ({
            ...cert,
            displayIndex: index + 1 // Adjust index to start from 1
        }));
    }
    addCertification() {
        if (this.certifications != []) {
            this.showCertAddButton = false;
        } else {
            this.showCertAddButton = true;
        }
        if (this.certifications.length < 4) {
            const newCert = { id: this.certifications.length, name: '', issuedBy: '', issuedDate: '' };
            this.certifications = [...this.certifications, newCert];
        }
        console.log('certifications', JSON.stringify(this.certifications, null, 2));
    }

    removeExperience(event) {

        const id = parseInt(event.target.dataset.id);
        const wasPresent = this.experience.find(exp => exp.id === id)?.present;

        this.experience = this.experience.filter(exp => exp.id !== id);

        if (wasPresent) {
            // Re-enable all checkboxes if the "present" experience is removed
            this.experience = this.experience.map(exp => ({
                ...exp,
                disablePresentCheckbox: false,
            }));
        }
        if (this.experience.length > 0) {
            console.log('if');
            this.showExpAddButton = false;
        } else {
            console.log('else');
            this.showExpAddButton = true;
        }

        console.log('experience', JSON.stringify(this.experience, null, 2));
    }

    removeProject(event) {

        const id = parseInt(event.target.dataset.id);
        const wasPresent = this.project.find(pro => pro.id === id)?.present;

        this.project = this.project.filter(pro => pro.id !== id);

        // If the removed experience was marked as present, enable all other checkboxes
        if (wasPresent) {
            this.project = this.project.map(pro => ({
                ...pro,
                disablePresentCheckbox: false
            }));
        }
        if (this.project.length > 0) {
            console.log('if');
            this.showProjAddButton = false;
        } else {
            console.log('else');
            this.showProjAddButton = true;
        }
        console.log('project', JSON.stringify(this.project, null, 2));
    }

    removeCertification(event) {

        const id = event.target.dataset.id;
        this.certifications = this.certifications.filter(cert => cert.id != id);
        if (this.certifications.length > 0) {
            console.log('if');
            this.showCertAddButton = false;
        } else {
            console.log('else');
            this.showCertAddButton = true;
        }
        console.log('certifications', JSON.stringify(this.certifications, null, 2));
    }

    openfileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
        this.hideModalBox();
    }

    showModalBox() {
        this.isShowModal = true;
    }

    hideModalBox() {
        this.isShowModal = false;
    }


    handleProfile(event) {
        const field = event.target.name;
        this.profile[field] = event.target.value;
        console.log('profile', JSON.stringify(this.profile, null, 2));
    }

    handleEducationChange(event) {
        const fieldName = event.target.name;
        const newValue = event.target.value;

        // if (fieldName === 'graduationPresent') {
        //     this.education.graduationPresent = event.target.checked;
        //     if (this.education.graduationPresent) {
        //         this.ispostGraduation = false;
        //         this.education.graduationEndDate = 'Present';
        //     } else {
        //         this.education.graduationEndDate = '';
        //     }
        //     console.log('education', JSON.stringify(this.education, null, 2));
        //     return;
        // }

        if (fieldName.includes('StartDate') || fieldName.includes('EndDate')) {
            const isStartDate = fieldName.includes('StartDate');
            const isEndDate = fieldName.includes('EndDate');
            const section = fieldName.replace('StartDate', '').replace('EndDate', '');

            const startDateField = `${section}StartDate`;
            const endDateField = `${section}EndDate`;

            const startDate = isStartDate ? newValue : this.education[startDateField];
            const endDate = isEndDate ? newValue : this.education[endDateField];

            if (!this.education.graduationPresent) {
                const adjustedEndDate = this.validateAndAdjustDates(startDate, endDate);
                if (isStartDate) {
                    this.education[startDateField] = startDate;
                    this.education[endDateField] = adjustedEndDate;
                } else {
                    this.education[endDateField] = adjustedEndDate;
                }
            } else {
                if (isStartDate) {
                    this.education[startDateField] = startDate;
                }
            }
        }

        if (fieldName == 'seniorsecondaryMarksType') {
            if (newValue != 'Percentage') {
                this.seniorSecondaryMarks = true;
                this.education.seniorsecondaryPercentage = '';
                console.log('seniorSecondaryMarks', this.seniorSecondaryMarks);

            }
            else {
                this.seniorSecondaryMarks = false;
                this.education.seniorsecondaryPercentage = '';
                console.log('seniorSecondaryMarks', this.seniorSecondaryMarks);
            }
        }
        else if (fieldName == 'graduationMarksType') {
            if (newValue != 'Percentage') {
                this.graduationMarks = true;
                this.education.graduationPercentage = '';
                console.log('graduationMarks', this.graduationMarks);
            }
            else {
                this.graduationMarks = false;
                this.education.graduationPercentage = '';
                console.log('graduationMarks', this.graduationMarks);
            }
        }
        this.education[fieldName] = newValue;

        console.log(JSON.stringify(this.education, null, 2));
    }

    //=============================================
    handleGraduationEducationChange(event) {
        const fieldName = event.target.name;
        const newValue = event.target.value;

        if (fieldName === 'graduationPresent') {
            this.graduationEducation.graduationPresent = event.target.checked;
            if (this.graduationEducation.graduationPresent) {
                this.graduationEducation.graduationEndDate = 'Present';
                console.log(JSON.stringify(this.graduationEducation, null, 2));

            } else {
                this.graduationEducation.graduationEndDate = '';
                console.log(JSON.stringify(this.graduationEducation, null, 2));

            }
            console.log('graduationEducation', JSON.stringify(this.graduationEducation));
            return;
        }

        if (fieldName.includes('StartDate') || fieldName.includes('EndDate')) {
            const isStartDate = fieldName.includes('StartDate');
            const isEndDate = fieldName.includes('EndDate');
            const section = fieldName.replace('StartDate', '').replace('EndDate', '');

            const startDateField = `${section}StartDate`;
            const endDateField = `${section}EndDate`;

            const startDate = isStartDate ? newValue : this.graduationEducation[startDateField];
            const endDate = isEndDate ? newValue : this.graduationEducation[endDateField];

            if (!this.graduationEducation.graduationPresent) {
                const adjustedEndDate = this.validateAndAdjustDates(startDate, endDate);
                if (isStartDate) {
                    this.graduationEducation[startDateField] = startDate;
                    this.graduationEducation[endDateField] = adjustedEndDate;
                } else {
                    this.graduationEducation[endDateField] = adjustedEndDate;
                }
            } else {
                if (isStartDate) {
                    this.graduationEducation[startDateField] = startDate;
                }
            }
        }

        if (fieldName == 'graduationMarksType') {
            if (newValue != 'Percentage') {
                this.postGraduationMarks = true;
                this.graduationEducation.graduationPercentage = '';
                console.log('graduationMarks', this.graduationMarks);
            }
            else {
                this.graduationMarks = false;
                this.graduationEducation.graduationPercentage = '';
                console.log('graduationMarks', this.graduationMarks);
            }
        }

        this.graduationEducation[fieldName] = newValue;
        console.log('graduationEducation', JSON.stringify(this.graduationEducation, null, 2));

    }
    //=============================================

    handlePostGraduationEducationChange(event) {
        const fieldName = event.target.name;
        const newValue = event.target.value;

        if (fieldName === 'postGraduationPresent') {
            this.postgraduationEducation.postGraduationPresent = event.target.checked;
            if (this.postgraduationEducation.postGraduationPresent) {
                this.postgraduationEducation.postGraduationEndDate = 'Present';
                console.log(JSON.stringify(this.postgraduationEducation, null, 2));

            } else {
                this.postgraduationEducation.postGraduationEndDate = '';
                console.log(JSON.stringify(this.postgraduationEducation, null, 2));

            }
            console.log('postgraduationEducation', JSON.stringify(this.postgraduationEducation));
            return;
        }

        if (fieldName.includes('StartDate') || fieldName.includes('EndDate')) {
            const isStartDate = fieldName.includes('StartDate');
            const isEndDate = fieldName.includes('EndDate');
            const section = fieldName.replace('StartDate', '').replace('EndDate', '');

            const startDateField = `${section}StartDate`;
            const endDateField = `${section}EndDate`;

            const startDate = isStartDate ? newValue : this.postgraduationEducation[startDateField];
            const endDate = isEndDate ? newValue : this.postgraduationEducation[endDateField];

            if (!this.postgraduationEducation.graduationPresent) {
                const adjustedEndDate = this.validateAndAdjustDates(startDate, endDate);
                if (isStartDate) {
                    this.postgraduationEducation[startDateField] = startDate;
                    this.postgraduationEducation[endDateField] = adjustedEndDate;
                } else {
                    this.postgraduationEducation[endDateField] = adjustedEndDate;
                }
            } else {
                if (isStartDate) {
                    this.postgraduationEducation[startDateField] = startDate;
                }
            }
        }

        if (fieldName == 'postGraduationMarksType') {
            if (newValue != 'Percentage') {
                this.postGraduationMarks = true;
                this.postgraduationEducation.postGraduationPercentage = '';
                console.log('postGraduationMarks', this.postGraduationMarks);
            }
            else {
                this.postGraduationMarks = false;
                this.postgraduationEducation.postGraduationPercentage = '';
                console.log('postGraduationMarks', this.postGraduationMarks);
            }
        }

        this.postgraduationEducation[fieldName] = newValue;
        console.log('postgraduationEducation', JSON.stringify(this.postgraduationEducation, null, 2));

    }

    handleExperienceChange(event) {

        const id = parseInt(event.target.dataset.id);
        const fieldName = event.target.name;
        const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        const updatedExperience = this.experience.map(exp => {
            if (exp.id === id) {
                if (fieldName === 'present') {
                    exp.present = newValue;
                    exp.to = newValue ? 'Present' : '';
                } else if (fieldName === 'from' || fieldName === 'to') {
                    exp[fieldName] = newValue;
                    if (fieldName === 'from') {
                        exp.to = this.validateAndAdjustDates(newValue, exp.to);
                    }
                } else if (fieldName === 'summary') {
                    if (newValue.length > 400) {
                        this.expValidity = false;
                        this.showToast('Error', '300 Characters only', 'error');
                    } else {
                        this.expValidity = true;
                        exp.summary = newValue;
                    }
                } else {
                    exp[fieldName] = newValue;
                }
            }
            return exp;
        });

        const isAnyPresent = updatedExperience.some(exp => exp.present);

        const finalExperience = updatedExperience.map(exp => ({
            ...exp,
            disablePresentCheckbox: isAnyPresent && !exp.present, // Disable other checkboxes if one is present
        }));

        this.experience = finalExperience;
        console.log('experience', JSON.stringify(this.experience, null, 2));
    }

    handleProjectChange(event) {
        const id = parseInt(event.target.dataset.id);
        const fieldName = event.target.name;
        const newValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value;

        const updatedProject = this.project.map(pro => {
            if (pro.id === id) {
                if (fieldName === 'present') {
                    pro.present = newValue;
                    pro.to = newValue ? 'Present' : '';
                } else if (fieldName === 'from' || fieldName === 'to') {
                    pro[fieldName] = newValue;
                    if (fieldName === 'from') {
                        pro.to = this.validateAndAdjustDates(newValue, pro.to);
                    }
                } else if (fieldName === 'summary') {
                    if (newValue.length > 400) {
                        this.projValidity = false;
                        this.showToast('Error', '300 Characters only', 'error');
                    } else {
                        this.projValidity = true;
                        pro.summary = newValue;
                    }
                } else {
                    pro[fieldName] = newValue;
                }
            }
            return pro;
        });

        const isAnyPresent = updatedProject.some(pro => pro.present);

        const finalProject = updatedProject.map(pro => ({
            ...pro,
            disablePresentCheckbox: isAnyPresent && !pro.present
        }));

        this.project = finalProject;
        console.log(JSON.stringify(this.project, null, 2));
    }

    handleCertificationChange(event) {
        const id = event.target.dataset.id;
        const field = event.target.name;
        const newValue = event.target.value;

        this.certifications = this.certifications.map(cert => {
            if (cert.id === parseInt(id)) {
                return { ...cert, [field]: newValue };
            }
            return cert;
        });
        console.log('certifications', JSON.stringify(this.certifications, null, 2));
    }

    validateAndAdjustDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (end < start) {
            return start.toISOString().split('T')[0];
        }
        return endDate;
    }

    checkAllFieldsFilled() {
        const isObjectEmpty = (obj) => {
            return Object.values(obj).some(value => {
                if (typeof value === 'string') {
                    return value.trim() === '';
                }
                if (typeof value === 'boolean' || typeof value === 'number') {
                    return false;
                }
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    return isObjectEmpty(value);
                }
                if (Array.isArray(value)) {
                    return value.length === 0 || value.some(isObjectEmpty);
                }
                return value === null || value === undefined;
            });
        };

        if (isObjectEmpty(this.profile)) {
            this.showToast('Error', 'Profile fields are not completely filled.', 'error');
            console.log("Profile fields are not completely filled.");
            return false;
        }

        if (isObjectEmpty(this.education)) {
            this.showToast('Error', 'Education fields are not completely filled.', 'error');
            console.log("Education fields are not completely filled.");
            return false;
        }

        if (this.experience.some(exp => isObjectEmpty(exp))) {
            this.showToast('Error', 'Experience fields are not completely filled.', 'error');
            console.log("Experience fields are not completely filled.");
            return false;
        }

        if (this.project.some(pro => isObjectEmpty(pro))) {
            this.showToast('Error', 'Project fields are not completely filled.', 'error');
            console.log("Project fields are not completely filled.");
            return false;
        }

        if (this.skills == []) {
            this.showToast('Error', 'Skills are not completely filled.', 'error');
            console.log("Skills are not completely filled.");
            return false;
        }

        if (this.certifications.some(cert => isObjectEmpty(cert))) {
            this.showToast('Error', 'Certification fields are not completely filled.', 'error');
            console.log("Certification fields are not completely filled.");
            return false;
        }

        return true;
    }

    async generatePDF() {
        const data = {
            imageUrl: this.imageUrl,
            profile: this.profile,
            education: this.education,
            experience: this.experience,
            project: this.project,
            skills: this.skills,
            certifications: this.certifications
        };
        console.log(JSON.stringify(data, null, 2));

        if (this.checkAllFieldsFilled()) {
            var doc = await this.resumePdf();
            console.log('doc', doc);

            if (doc) {
                doc.save("resume.pdf");
                this.showToast('Success', 'Resume Downloaded Successfully.', 'success');
            }
        }


    }

    convertHtmlToText(htmlString) {
        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString.trim();

        // Check if the content is a list (<ul> or <ol>)
        const listItems = tempDiv.querySelectorAll("ul li, ol li");
        if (listItems.length > 0) {
            // Convert list items to bullet points
            return Array.from(listItems)
                .map(li => `• ${li.textContent.trim()}`) // Add bullet symbol
                .join("\n"); // Join with newlines
        }

        // Handle paragraphs or plain text (<p>)
        const paragraphs = tempDiv.querySelectorAll("p");
        if (paragraphs.length > 0) {
            return Array.from(paragraphs)
                .map(p => p.textContent.trim()) // Extract text from <p>
                .join("\n\n"); // Separate paragraphs with double newlines
        }

        // Fallback for plain text without tags
        return tempDiv.textContent.trim();
    }

    getSortedExperiences() {
        return [...this.experience].sort((a, b) => {
            const dateA = a.present ? new Date() : new Date(a.to);
            const dateB = b.present ? new Date() : new Date(b.to);
            return dateB - dateA; // Descending order
        });
    }

    getSortedProjects() {
        return [...this.project].sort((a, b) => {
            const dateA = a.present ? new Date() : new Date(a.to);
            const dateB = b.present ? new Date() : new Date(b.to);
            return dateB - dateA; // Descending order
        });
    }

    async resumePdf() {

        const sortedExperiences = this.getSortedExperiences();
        const sortedProjects = this.getSortedProjects();

        const imageUrl = this.imageUrl;
        const profile = this.profile;
        const education = this.education;
        const graduationEducation = this.graduationEducation;
        const postgraduationEducation = this.postgraduationEducation;
        const experience = sortedExperiences;
        const project = sortedProjects;
        const skills = this.skills;
        const certifications = this.certifications;
        console.log(
            'imageUrl:', imageUrl,
            'profile:', profile,
            'education:', education,
            'graduationEducation:', graduationEducation,
            'postgraduationEducation:', postgraduationEducation,
            'experience:', experience,
            'project:', project,
            'skills:', skills,
            'certifications:', certifications
        );

        const loadImage = async (url) => {
            // Skip if default image
            if (url === 'https://cdn-icons-png.flaticon.com/128/9408/9408175.png') {
                return null;
            }
        
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                
                img.onload = () => {
                    // Create an offscreen canvas for image processing
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set fixed dimensions for the circular frame
                    const FRAME_SIZE = 300; // This will be scaled down in the PDF
                    canvas.width = FRAME_SIZE;
                    canvas.height = FRAME_SIZE;
                    
                    // Calculate scaling and positioning to center and crop image properly
                    const size = Math.min(img.width, img.height);
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;
                    
                    // Make canvas transparent
                    ctx.clearRect(0, 0, FRAME_SIZE, FRAME_SIZE);
                    
                    // Create circular clipping path
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(FRAME_SIZE/2, FRAME_SIZE/2, FRAME_SIZE/2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    
                    // Draw scaled and centered image
                    ctx.drawImage(
                        img,
                        x, y,          // Source position (crop center)
                        size, size,    // Source dimensions (square crop)
                        0, 0,          // Destination position
                        FRAME_SIZE, FRAME_SIZE  // Destination dimensions
                    );
                    
                    ctx.restore();
                    
                    try {
                        // Use PNG to maintain transparency
                        const dataUrl = canvas.toDataURL('image/png', 1.0);
                        resolve(dataUrl);
                    } catch (error) {
                        console.error('Error processing image:', error);
                        resolve(null);
                    }
                };
                
                img.onerror = () => {
                    console.error('Error loading image');
                    resolve(null);
                };
                
                // Set timeout to prevent hanging
                setTimeout(() => {
                    img.src = '';
                    resolve(null);
                }, 5000);
                
                img.src = url;
            });
        };

        const doc = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        //========================================================
        // Constants for layout
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = {
            top: 12,
            right: 15,
            bottom: 12,
            left: 15
        };
        const contentWidth = pageWidth - (margin.left + margin.right);
        const lineSpacing = 5; // Consistent line spacing

        // Colors
        const colors = {
            primary: [41, 128, 185],
            secondary: [52, 73, 94],
            accent: [236, 240, 241],
            text: [44, 62, 80],
            lightText: [127, 140, 141],
            line: [189, 195, 199]
        };

        // Track current Y position
        let yPos = margin.top;

        // Helper function for page breaks
        const checkAndAddPage = (requiredSpace) => {
            if (yPos + requiredSpace > pageHeight - margin.bottom) {
                doc.addPage();
                yPos = margin.top;
                return true;
            }
            return false;
        };

        // Helper function to add section header with connected line
        const addSectionHeader = (title) => {
            doc.setFillColor(...colors.primary);
            doc.rect(margin.left - 5, yPos - 5, 6, 6, 'F');

            doc.setDrawColor(...colors.line);
            doc.setLineWidth(0.3);
            doc.line(margin.left - 5, yPos + 1, pageWidth - margin.right, yPos + 1);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(...colors.primary);
            doc.text(title, margin.left + 6, yPos);

            yPos += 8;
        };

        console.log('started');

        if (this.imageUrl != 'https://cdn-icons-png.flaticon.com/128/9408/9408175.png') {
            // Load image helper
            // var loadImage = (url) => {
            //     return new Promise((resolve, reject) => {
            //         const img = new Image();
            //         img.crossOrigin = 'Anonymous';
            //         img.onload = () => {
            //             const canvas = document.createElement('canvas');
            //             canvas.width = img.width;
            //             canvas.height = img.height;
            //             const ctx = canvas.getContext('2d');

            //             ctx.beginPath();
            //             ctx.arc(img.width / 2, img.height / 2, img.width / 2, 0, Math.PI * 2, true);
            //             ctx.closePath();
            //             ctx.clip();

            //             ctx.drawImage(img, 0, 0);
            //             try {
            //                 const dataUrl = canvas.toDataURL('image/png');
            //                 resolve(dataUrl);
            //             } catch (error) {
            //                 reject(error);
            //             }
            //         };
            //         img.onerror = reject;
            //         img.src = url;
            //     });
            // };

            try {
                const imageData = await loadImage(imageUrl);
                if (imageData) {
                    const imageSize = 28; // Slightly larger size
                    const imageX = pageWidth - margin.right - imageSize + 2; // Adjusted position
                    const imageY = 2; // Moved slightly higher
                    doc.addImage(imageData, 'PNG', imageX, imageY, imageSize, imageSize, undefined, 'FAST');
                }
            } catch (error) {
                console.error('Error adding image to PDF:', error);
            }
        }

        console.log('image loaded');
        // Header section
        const headerHeight = 35;
        doc.setFillColor(...colors.accent);
        doc.rect(0, 0, pageWidth, headerHeight, 'F');

        // Add profile image
        try {
            const imageData = await loadImage(imageUrl);
            const imageSize = 25;
            const imageX = pageWidth - margin.right - imageSize;
            const imageY = 5;
            doc.addImage(imageData, 'PNG', imageX, imageY, imageSize, imageSize, undefined, 'FAST');
        } catch (error) {
            console.error('Error loading image:', error);
        }

        console.log('Name Contact');
        // Name and contact with wrapping
        doc.setFontSize(22);
        doc.setTextColor(...colors.primary);
        doc.setFont('helvetica', 'bold');
        const nameText = `${profile.firstname} ${profile.lastname}`;
        const wrappedName = doc.splitTextToSize(nameText, contentWidth);
        doc.text(wrappedName, margin.left, 16);

        doc.setFontSize(9);
        doc.setTextColor(...colors.secondary);
        doc.setFont('helvetica', 'normal');
        const contactInfo = [profile.email, profile.phone].join(' | ');
        const wrappedContact = doc.splitTextToSize(contactInfo, contentWidth);
        doc.text(wrappedContact, margin.left, 24);

        yPos = headerHeight + 8;

        console.log('Summary');
        // Summary section with proper spacing
        addSectionHeader('Summary');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...colors.text);
        const wrappedSummary = doc.splitTextToSize(profile.summary, contentWidth);
        doc.text(wrappedSummary, margin.left, yPos);
        yPos += wrappedSummary.length * lineSpacing + 4;


        console.log('Skills');
        // Skills Section with centered text and smaller margins
        checkAndAddPage(30);
        addSectionHeader('SKILLS');

        const skillBoxMargin = 3; // Reduced margin between skill boxes
        const maxBoxWidth = (contentWidth - skillBoxMargin * 2) / 3;
        let currentX = margin.left;
        let maxHeightInRow = 0;

        skills.forEach((skill, index) => {
            doc.setFontSize(9);
            const wrappedSkill = doc.splitTextToSize(skill, maxBoxWidth - 6); // Reduced internal padding
            const skillHeight = wrappedSkill.length * lineSpacing + 4; // Reduced vertical padding

            if (currentX + maxBoxWidth > pageWidth - margin.right) {
                currentX = margin.left;
                yPos += maxHeightInRow + skillBoxMargin;
                maxHeightInRow = 0;
            }

            if (checkAndAddPage(skillHeight + 8)) {
                currentX = margin.left;
                maxHeightInRow = 0;
            }

            // Background pill with smaller margins
            doc.setFillColor(...colors.accent);
            const boxWidth = maxBoxWidth - skillBoxMargin;
            doc.roundedRect(currentX, yPos - 2, boxWidth, skillHeight, 2, 2, 'F');

            // Center text horizontally and vertically
            doc.setTextColor(...colors.text);
            wrappedSkill.forEach((line, lineIndex) => {
                const lineWidth = doc.getTextWidth(line);
                const xOffset = (boxWidth - lineWidth) / 2;
                const yOffset = (lineIndex * lineSpacing) + (skillHeight - (wrappedSkill.length * lineSpacing)) / 2;
                doc.text(line, currentX + xOffset, yPos + yOffset);
            });

            maxHeightInRow = Math.max(maxHeightInRow, skillHeight);
            currentX += maxBoxWidth;
        });

        yPos += maxHeightInRow + 6;

        console.log('Education');
        // Education Section with proper wrapping
        checkAndAddPage(30);
        addSectionHeader('EDUCATION');

        const addEducationEntry = (institute, degree, branch, percentage, marksType, startDate, endDate, present) => {
            checkAndAddPage(25);

            // Institute name with wrapping
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.secondary);
            const wrappedInstitute = doc.splitTextToSize(institute, contentWidth - 40);
            doc.text(wrappedInstitute, margin.left, yPos);
            yPos += wrappedInstitute.length * lineSpacing;

            // Degree and branch with wrapping
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.primary);
            const degreeText = `${degree} - ${branch}`;
            const wrappedDegree = doc.splitTextToSize(degreeText, contentWidth - 40);
            doc.text(wrappedDegree, margin.left, yPos);
            yPos += wrappedDegree.length * lineSpacing;

            // Percentage/CGPA below degree
            doc.setFontSize(9);
            doc.setTextColor(...colors.lightText);
            const marksText = marksType == 'CGPA' ? `${percentage} CGPA` : `${percentage}%`;
            doc.text(marksText, margin.left, yPos);

            // Date on right
            const dateText = present ?
                `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present` :
                `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
            const dateWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - margin.right - dateWidth, yPos - wrappedDegree.length * lineSpacing - wrappedInstitute.length * lineSpacing);

            yPos += lineSpacing + 4;
        };

        const addSchoolEducationEntry = (institute, stream, percentage, marksType, startDate, endDate) => {
            checkAndAddPage(25);

            // Institute name with wrapping
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...colors.secondary);
            const wrappedInstitute = doc.splitTextToSize(institute, contentWidth - 40);
            doc.text(wrappedInstitute, margin.left, yPos);
            yPos += wrappedInstitute.length * lineSpacing;

            // Stream with wrapping
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...colors.primary);
            const wrappedStream = doc.splitTextToSize(stream, contentWidth - 40);
            doc.text(wrappedStream, margin.left, yPos);
            yPos += wrappedStream.length * lineSpacing;

            // Percentage/CGPA below stream
            doc.setFontSize(9);
            doc.setTextColor(...colors.lightText);
            const marksText = marksType == 'CGPA' ? `${percentage} CGPA` : `${percentage}%`;
            doc.text(marksText, margin.left, yPos);

            // Date on right
            const dateText = `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
            const dateWidth = doc.getTextWidth(dateText);
            doc.text(dateText, pageWidth - margin.right - dateWidth, yPos - wrappedStream.length * lineSpacing - wrappedInstitute.length * lineSpacing);

            yPos += lineSpacing + 4;
        };

        yPos += 2;

        console.log('Education Entries1');
        if (this.ispostGraduation) {
            addEducationEntry(
                postgraduationEducation.postGraduationInstitute,
                postgraduationEducation.postGraduationDegree,
                postgraduationEducation.postGraduationbranch,
                postgraduationEducation.postGraduationPercentage,
                postgraduationEducation.postGraduationMarksType,
                postgraduationEducation.postGraduationStartDate,
                postgraduationEducation.postGraduationEndDate,
                postgraduationEducation.postGraduationPresent
            );
        }

        if (this.isGraduation) {
            addEducationEntry(
                graduationEducation.graduationInstitute,
                graduationEducation.graduationDegree,
                graduationEducation.graduationBranch,
                graduationEducation.graduationPercentage,
                graduationEducation.graduationMarksType,
                graduationEducation.graduationStartDate,
                graduationEducation.graduationEndDate,
                graduationEducation.graduationPresent
            );
        }

        addSchoolEducationEntry(
            education.seniorsecondaryInstitute,
            education.stream,
            education.seniorsecondaryPercentage,
            education.seniorsecondaryMarksType,
            education.seniorsecondaryStartDate,
            education.seniorsecondaryEndDate,
        );

        console.log('Experience');
        // Experience Section with proper wrapping
        if (experience.length > 0) {
            addSectionHeader('EXPERIENCE');
            experience.forEach((exp, index) => {
                checkAndAddPage(30);

                // Role and company with wrapping
                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colors.secondary);
                const wrappedRole = doc.splitTextToSize(exp.role, contentWidth - 40); // Leave space for date
                doc.text(wrappedRole, margin.left, yPos);
                yPos += wrappedRole.length * lineSpacing;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...colors.primary);
                const wrappedCompany = doc.splitTextToSize(exp.company, contentWidth - 40);
                doc.text(wrappedCompany, margin.left, yPos);
                yPos += wrappedCompany.length * lineSpacing;

                // Dates aligned right
                doc.setFontSize(9);
                doc.setTextColor(...colors.lightText);
                const dateText = exp.present ?
                    `${new Date(exp.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present` :
                    `${new Date(exp.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(exp.to).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, pageWidth - margin.right - dateWidth, yPos - wrappedCompany.length * lineSpacing - wrappedRole.length * lineSpacing);

                // Summary with proper wrapping and spacing
                yPos += 2;
                doc.setTextColor(...colors.text);
                const wrappedExpSummary = doc.splitTextToSize(this.convertHtmlToText(exp.summary), contentWidth - 5);
                doc.text(wrappedExpSummary, margin.left + 3, yPos);
                yPos += wrappedExpSummary.length * lineSpacing + 3;
            });
        }
        yPos += 3;

        console.log('project');
        // Projects Section with proper wrapping
        if (project.length > 0) {
            yPos += 3;
            checkAndAddPage(30);
            addSectionHeader('PROJECTS');
            project.forEach((proj, index) => {
                checkAndAddPage(25);

                doc.setFontSize(11);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colors.secondary);
                const wrappedProjectName = doc.splitTextToSize(proj.projectName, contentWidth - 40);
                doc.text(wrappedProjectName, margin.left, yPos);
                yPos += wrappedProjectName.length * lineSpacing;

                // Dates aligned right
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...colors.lightText);
                const dateText = proj.present ?
                    `${new Date(proj.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - Present` :
                    `${new Date(proj.from).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(proj.to).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, pageWidth - margin.right - dateWidth, yPos - wrappedProjectName.length * lineSpacing);

                // Summary with proper wrapping and spacing
                yPos += 2;
                doc.setTextColor(...colors.text);
                const wrappedProjectSummary = doc.splitTextToSize(this.convertHtmlToText(proj.summary), contentWidth - 5);
                doc.text(wrappedProjectSummary, margin.left + 3, yPos);
                yPos += wrappedProjectSummary.length * lineSpacing + 3;
            });
        }




        console.log('Certifications');

        if (certifications.length > 0) {
            yPos += 3;

            // Certifications Section with proper wrapping
            checkAndAddPage(30);
            addSectionHeader('CERTIFICATIONS');

            certifications.forEach((cert, index) => {
                checkAndAddPage(15);

                // Certificate name with wrapping
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...colors.secondary);
                const wrappedCertName = doc.splitTextToSize(cert.name, contentWidth - 5);
                doc.text(wrappedCertName, margin.left, yPos);
                yPos += wrappedCertName.length * lineSpacing;

                // Issuer and date with wrapping
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...colors.lightText);
                const dateText = new Date(cert.issuedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                const issuerText = `${cert.issuedBy} - ${dateText}`;
                const wrappedIssuer = doc.splitTextToSize(issuerText, contentWidth - 5);
                doc.text(wrappedIssuer, margin.left, yPos);
                yPos += wrappedIssuer.length * lineSpacing + 4;
            });
        }

        console.log('Footer');
        return doc;
    };

    async handleSaveButton() {

        const doc = await this.resumePdf();
        if (!doc) return;

        const pdfData = doc.output('datauristring').split(',')[1];

        const data = {
            imageUrl: this.imageUrl,
            profile: this.profile,
            education: this.education,
            experience: this.experience,
            project: this.project,
            skills: this.skills,
            certifications: this.certifications

        };
        console.log(JSON.stringify(data, null, 2));

        try {
            const resumeId = await saveResumeRecord({
                data: JSON.stringify(data),
                base64FileData: pdfData,
                fileName: `${this.profile.fullname}_Resume.pdf`
            });

            console.log(`Resume record created successfully with Id: ${resumeId}`);
            this.showToast('Success', 'Resume saved successfully.', 'success');
        } catch (error) {
            console.error('Error saving resume:', error);
            this.showToast('Error', 'Failed to save resume. Please try again.', 'error');
        }
    }

    handleCancelButton() {
        this.ispostGraduation = false;
        this.isGraduation = false;
        this.showExpAddButton = true;
        this.showProjAddButton = true;
        this.showCertAddButton = true;
        

        this.imageUrl = 'https://cdn-icons-png.flaticon.com/128/9408/9408175.png';
        this.profile = { firstname: '', lastname: '', email: '', phone: '', summary: '' };
        this.education = {
            seniorsecondaryInstitute: '',
            stream: '',
            seniorsecondaryPercentage: '',
            seniorsecondaryMarksType: 'Percentage',
            seniorsecondaryStartDate: '',
            seniorsecondaryEndDate: '',
        };
        this.graduationEducation = {
            graduationInstitute: '',
            graduationDegree: '',
            graduationBranch: '',
            graduationPercentage: '',
            graduationMarksType: 'Percentage',
            graduationStartDate: '',
            graduationEndDate: '',
            graduationPresent: false
        }
        this.postgraduationEducation = {
            postGraduationInstitute: '',
            postGraduationDegree: '',
            postGraduationbranch: '',
            postGraduationPercentage: '',
            postGraduationMarksType: 'Percentage',
            postGraduationStartDate: '',
            postGraduationEndDate: '',
            postGraduationPresent: false
        };
        this.experience = [];
        this.project = [];
        this.skills = [];
        this.certifications = [];

    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }
}