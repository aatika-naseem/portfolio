require("dotenv").config();

const projects = [
    { title: "ZERO//DAY", description: "A bold, movie-inspired website with a dark theme and several pages.", tech: ["HTML", "Tailwind", "JavaScript"] },
    { title: "Herbarium Website", description: "A five-page site with a working contact form.", tech: ["HTML", "Tailwind", "Formspree"] },
    { title: "To-Do List App", description: "A mobile app built with React Native and Expo, packaged as an APK.", tech: ["React Native", "Expo"] },
];

(async () => {
    for (const p of projects) {
        const res = await fetch("http://localhost:5000/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-admin-key": process.env.ADMIN_KEY },
            body: JSON.stringify(p),
        });
        console.log(p.title, res.status);
    }
})();