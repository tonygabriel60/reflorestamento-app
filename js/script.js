const temas = {
    'Pau-Brasil': '#8B0000',
    'Castanheira': '#8B4513',
    'Peroba-Rosa': '#FF69B4'
};

const usuariosFakes = [
    { 
        id: 1, 
        nome: "Divaldo Samalombo", 
        email: "divaldo@email.com", 
        avatar: "Pau-Brasil", 
        corTema: "#8B0000", 
        bio: "Amante de musica e da natureza",
        totalArvores: 50
    },
    { 
        id: 2, 
        nome: "Vania Domingos", 
        email: "vania@email.com", 
        avatar: "Castanheira", 
        corTema: "#8B4513", 
        bio: "Plantando árvores desde 2000",
        totalArvores: 80
    },
    { 
        id: 3, 
        nome: "Ruth Gabriel", 
        email: "ruth@email.com", 
        avatar: "Peroba-Rosa", 
        corTema: "#FF69B4", 
        bio: "Ativista dos direitos humanos e ambientais",
        totalArvores: 150
    }
];

if (!localStorage.getItem('usuarios')) {
    localStorage.setItem('usuarios', JSON.stringify(usuariosFakes));
}

function determinarFase(totalArvores) {
    if (totalArvores < 100) return 'plantada';
    if (totalArvores < 300) return 'broto';
    if (totalArvores < 700) return 'jovem';
    return 'madura';
}

if (document.getElementById('cadastroForm')) {
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const avatar = document.getElementById('avatar').value;
        
        const novoUsuario = {
            id: Date.now(),
            nome,
            email,
            senha,
            avatar,
            corTema: temas[avatar],
            bio: "Olá! Eu sou um entusiasta do reflorestamento!",
            totalArvores: 0
        };
        
        localStorage.setItem('usuario', JSON.stringify(novoUsuario));
        
        const usuarios = [
            ...usuariosFakes,
            ...(JSON.parse(localStorage.getItem('usuarios')) || []).filter(u => ![1, 2, 3].includes(u.id)),
            novoUsuario
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        document.documentElement.style.setProperty('--cor-primaria', novoUsuario.corTema);
        window.location.href = 'acoes.html';
    });
}

if (document.getElementById('userName')) {
    function carregarPerfil() {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const acoes = JSON.parse(localStorage.getItem('acoesReflorestamento')) || [];
        
        if (usuario) {
            document.documentElement.style.setProperty('--cor-primaria', usuario.corTema);
            document.getElementById('userName').textContent = usuario.nome;
            document.getElementById('bioDisplay').textContent = usuario.bio || "Olá! Eu sou um entusiasta do reflorestamento!";
            document.getElementById('bioEdit').value = usuario.bio || "";
            atualizarAvatar(usuario);
            atualizarEstatisticas(usuario.id);
        }
    }

    function atualizarAvatar(usuario) {
        const totalArvores = usuario.totalArvores;
        const fase = determinarFase(totalArvores);
        const avatarImg = document.getElementById('userAvatar');
        avatarImg.src = `img/avatares/${usuario.avatar.toLowerCase()}-${fase}.png`;
        avatarImg.alt = `${usuario.avatar} ${fase}`;
        document.querySelectorAll('.evolution-stage').forEach(stage => stage.classList.remove('active'));
        
        if (totalArvores < 100) {
            document.getElementById('stage1').classList.add('active');
        } else if (totalArvores < 300) {
            document.getElementById('stage2').classList.add('active');
        } else if (totalArvores < 700) {
            document.getElementById('stage3').classList.add('active');
        } else {
            document.getElementById('stage4').classList.add('active');
        }
    }

    function atualizarEstatisticas(usuarioId) {
        const acoes = JSON.parse(localStorage.getItem('acoesReflorestamento')) || [];
        const acoesUsuario = acoes.filter(acao => acao.usuario === usuarioId);
        const totalArvores = acoesUsuario.reduce((total, acao) => total + parseInt(acao.quantidade), 0);
        const especiesUnicas = [...new Set(acoesUsuario.map(acao => acao.especie))].length;
        let ultimoPlantio = "-";
        if (acoesUsuario.length > 0) {
            const datas = acoesUsuario.map(acao => new Date(acao.data));
            const dataMaisRecente = new Date(Math.max(...datas));
            ultimoPlantio = dataMaisRecente.toLocaleDateString('pt-BR');
        }
        document.getElementById('totalTrees').textContent = totalArvores;
        document.getElementById('differentSpecies').textContent = especiesUnicas;
        document.getElementById('lastPlanting').textContent = ultimoPlantio;
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        usuario.totalArvores = totalArvores;
        localStorage.setItem('usuario', JSON.stringify(usuario));
    }

    document.getElementById('editBioBtn').addEventListener('click', function() {
        document.getElementById('bioDisplay').classList.add('hidden');
        document.getElementById('bioEdit').classList.remove('hidden');
        this.classList.add('hidden');
        document.getElementById('saveBioBtn').classList.remove('hidden');
    });

    document.getElementById('saveBioBtn').addEventListener('click', function() {
        const novaBio = document.getElementById('bioEdit').value;
        document.getElementById('bioDisplay').textContent = novaBio;
        document.getElementById('bioDisplay').classList.remove('hidden');
        document.getElementById('bioEdit').classList.add('hidden');
        document.getElementById('editBioBtn').classList.remove('hidden');
        this.classList.add('hidden');
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        usuario.bio = novaBio;
        localStorage.setItem('usuario', JSON.stringify(usuario));
    });

    document.addEventListener('DOMContentLoaded', carregarPerfil);
}

if (document.getElementById('podium')) {
    function carregarDestaques() {
        const podium = document.getElementById('podium');
        podium.innerHTML = '';
        const usuariosReais = JSON.parse(localStorage.getItem('usuarios')) || [];
        const todosUsuarios = [
            ...usuariosFakes,
            ...usuariosReais.filter(user => ![1, 2, 3].includes(user.id))
        ];
        const top3 = todosUsuarios.sort((a, b) => b.totalArvores - a.totalArvores).slice(0, 3);
        top3.forEach((usuario, index) => {
            const fase = determinarFase(usuario.totalArvores);
            const lugar = document.createElement('div');
            lugar.className = `podium-place ${['second-place', 'first-place', 'third-place'][index]}`;
            lugar.innerHTML = `
                <div class="podium-step">${index + 1}</div>
                <img src="img/avatares/${usuario.avatar.toLowerCase()}-${fase}.png" class="podium-avatar" alt="${usuario.avatar} ${fase}">
                <div class="podium-name">${usuario.nome}</div>
                <div class="podium-trees">${usuario.totalArvores} árvores</div>
            `;
            podium.appendChild(lugar);
        });
        document.getElementById('lastUpdate').textContent = `Última atualização: ${new Date().toLocaleDateString('pt-BR')}`;
    }

    document.addEventListener('DOMContentLoaded', carregarDestaques);
}