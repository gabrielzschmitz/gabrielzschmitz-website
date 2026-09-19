+++
title = "Simulação de Fluidos SPH usando ECS"
description = "Artigo sobre o Fluvius, um simulador de fluidos em tempo real baseado em Smoothed Particle Hydrodynamics (SPH) integrado à arquitetura Entity Component System (ECS) — formulação matemática, kernels, implementação em C++ e análise de desempenho."
date = 2026-09-18
aliases = ["fluvius"]

[taxonomies]
tags = ["SPH", "Simulação de Fluidos", "Entity Component System", "C++",
"Física Computacional", "Computação Gráfica"]

[extra]
author = ["gabrielzschmitz"]
language = "Português"
mathjax = true
hero = "header.svg"
hero_caption = "Imagem do cabeçalho por <a href=\"https://gabrielzschmitz.xyz\">gabrielzschmitz</a>, licenciada sob a <a href=\"https://creativecommons.org/licenses/by/4.0/\">licença Creative Commons 4.0 Atribuição</a>."
+++

<br>

Este post é a versão em blog do artigo **"Simulação de Fluidos SPH usando
ECS"**, escrito originalmente em LaTeX para o [**Fluvius**](https://github.com/gabrielzschmitz/Fluvius),
o meu simulador de fluidos baseado em *Smoothed Particle Hydrodynamics*. O
material-fonte completo (main.tex, seções e referências) está disponível no
repositório do projeto em
[Fluvius/article](https://github.com/gabrielzschmitz/Fluvius/tree/main/article).

---

A simulação de fluidos em tempo real exige grande capacidade computacional
devido ao cálculo contínuo das interações entre partículas. Entre os métodos
utilizados nesse contexto, o *Smoothed Particle Hydrodynamics* (SPH)
destaca-se por representar fluidos sem o uso de malhas estruturadas.

Este trabalho apresenta o desenvolvimento de uma simulação de fluidos baseada
em SPH integrada à arquitetura *Entity Component System* (ECS). A proposta
utiliza o ECS para organizar os dados da aplicação de forma modular, buscando
melhorar a estrutura do sistema e a eficiência da execução da simulação.

---

## 1. Introdução

A simulação computacional de fluidos possui ampla aplicação em áreas como
computação gráfica, engenharia, jogos digitais e simulações científicas.
Métodos capazes de reproduzir o comportamento dinâmico de líquidos e gases são
utilizados para modelar fenômenos físicos complexos, permitindo análises,
visualizações e experimentações de forma virtual. Entretanto, a simulação de
fluidos em tempo real ainda representa um desafio computacional significativo,
principalmente devido à grande quantidade de cálculos necessários para
representar interações físicas entre partículas.

Entre os métodos utilizados para simulação de fluidos, destaca-se o
*Smoothed Particle Hydrodynamics* (SPH), uma abordagem baseada em partículas
originalmente introduzida por Lucy [[1]](#referencias) e por Gingold e Monaghan
[[2]](#referencias). O método discretiza o fluido em pequenos elementos
independentes, denominados partículas, permitindo a aproximação das propriedades
físicas do fluido por meio da interação entre seus vizinhos. Diferentemente de
métodos baseados em malhas, o SPH apresenta maior flexibilidade para representar
superfícies livres, respingos e deformações complexas, tornando-se amplamente
utilizado em aplicações interativas e gráficas computacionais.

Na área de computação gráfica, o trabalho *Particle-Based Fluid Simulation for
Interactive Applications* [[3]](#referencias), de Müller, Charypar e Gross,
consolidou o uso do SPH em aplicações interativas ao propor uma abordagem
voltada para simulação de fluidos em tempo real. Os autores demonstraram que
métodos baseados em partículas podem simplificar o tratamento das equações de
conservação de massa e facilitar a representação de superfícies livres, além de
permitir a renderização direta das partículas para reconstrução visual do
fluido.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/real_fluid.jpeg"
alt="Exemplo de fluido real contido em um recipiente de vidro." width="550">
_Figura 1. Exemplo de fluido real contido em um recipiente de vidro, ilustrando
o comportamento contínuo e deformável característico dos fluidos estudados em
simulações computacionais._

Apesar de suas vantagens, implementações de SPH podem apresentar limitações de
desempenho devido à necessidade de atualização contínua do estado de milhares de
partículas e do cálculo frequente de vizinhança. Nesse contexto, arquiteturas
orientadas a dados, como o *Entity Component System* (ECS), surgem como uma
alternativa para melhorar organização, modularidade e eficiência computacional.
O ECS, popularizado por Scott Bilas na apresentação *A Data-Driven Game Object
System* [[4]](#referencias), propõe a separação entre dados e comportamento por
meio de componentes independentes, favorecendo melhor utilização de memória,
maior flexibilidade estrutural e potencial para paralelismo durante a execução.

Este trabalho apresenta o desenvolvimento de uma simulação de fluidos utilizando
o método SPH integrado à arquitetura ECS. A implementação foi desenvolvida de
forma incremental, iniciando pela modelagem individual de partículas sujeitas a
forças básicas, como gravidade e colisão, evoluindo posteriormente para a
interação entre múltiplas partículas por meio das equações de Navier-Stokes,
formuladas por Claude-Louis Navier e posteriormente desenvolvidas por George
Gabriel Stokes [[5]](#referencias), amplamente utilizadas na modelagem do
movimento de fluidos viscosos [[6, 7, 8]](#referencias), e como princípios para
o método SPH [[9]](#referencias). O objetivo é investigar como a adoção do ECS
pode contribuir para a organização estrutural do sistema e para a execução
eficiente das etapas da simulação, mantendo resultados visuais coerentes e
estabilidade física.

O restante deste artigo está organizado da seguinte forma: a **Seção 2**
descreve os fundamentos teóricos do método SPH e da arquitetura ECS, bem como os
procedimentos incrementais utilizados na implementação da simulação; a
**Seção 3** apresenta os resultados obtidos a partir da execução do sistema
desenvolvido; a **Seção 4** analisa os resultados observados, discutindo
limitações, impactos e possíveis melhorias da abordagem proposta; por fim, a
**Seção 5** resume as principais contribuições do trabalho e apresenta
perspectivas para trabalhos futuros.

---

## 2. Metodologia

As equações de Navier-Stokes descrevem o comportamento de fluidos em movimento
a partir da conservação de massa e da conservação de quantidade de movimento.
Para fluidos incompressíveis, essas equações permitem modelar os efeitos de
pressão, viscosidade e forças externas sobre o escoamento do fluido.

Embora as equações de Navier-Stokes permitam descrever com precisão o
comportamento de fluidos, sua resolução direta na forma contínua pode se tornar
computacionalmente custosa, principalmente em aplicações que exigem atualização
em tempo real. Isso ocorre porque fluidos são compostos por um número muito
grande de partículas interagindo simultaneamente, tornando inviável calcular de
forma exata todas as interações físicas presentes no sistema.

Dessa forma, métodos numéricos são utilizados para discretizar o fluido e
aproximar seu comportamento de maneira computacionalmente viável. Entre essas
abordagens, destacam-se os métodos particulados, nos quais o fluido é
representado por um conjunto discreto de partículas interagindo localmente.

Nesse contexto, o método *Smoothed Particle Hydrodynamics* (SPH), originalmente
proposto por Lucy [[1]](#referencias) e por Gingold e Monaghan
[[2]](#referencias), tornou-se uma das principais técnicas baseadas em
partículas para simulação de fluidos.

No método SPH, cada partícula representa uma pequena porção do fluido e
armazena propriedades físicas locais, como massa, densidade, pressão e
velocidade. Entretanto, representar diretamente todas as partículas presentes em
um fluido real seria computacionalmente inviável, já que fluidos podem ser
compostos por milhões de partículas interagindo simultaneamente.

Para tornar a simulação viável computacionalmente, o SPH aproxima o
comportamento contínuo do fluido utilizando uma quantidade significativamente
menor de partículas. Para isso, o método emprega funções de suavização
denominadas *smoothing kernels*, responsáveis por distribuir a influência de
cada partícula dentro de uma região limitada do espaço.

Em vez de tratar cada partícula como um ponto isolado, o kernel espalha suas
propriedades físicas ao redor de sua vizinhança, permitindo interpolar grandezas
físicas de forma contínua entre partículas vizinhas. Na prática, esse processo
atua de maneira semelhante a um filtro de suavização (*blur*), reduzindo espaços
vazios e descontinuidades entre partículas. Com isso, mesmo utilizando uma
quantidade reduzida de partículas, o sistema passa a apresentar comportamento
visual e físico semelhante ao de um fluido contínuo.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/smoothed_kernel.png"
alt="Mesma distribuição de partículas discretas antes e após a aplicação do kernel de suavização." width="650">
_Figura 2. Mesma distribuição de partículas discretas antes e após a aplicação
do kernel de suavização no método SPH._

A partir dessa representação particulada, torna-se possível aproximar as
equações da mecânica dos fluidos diretamente sobre o conjunto de partículas. No
SPH, as equações de Navier-Stokes são discretizadas de forma que propriedades
como pressão, viscosidade e aceleração possam ser calculadas localmente a partir
da interação entre partículas vizinhas.

A forma geral da equação de conservação de momento é apresentada na
**Equação 1**:

$$
\rho \frac{\mathrm{D}\mathbf{u}}{\mathrm{D}t} = -\nabla p + \nabla\cdot\boldsymbol{\tau} + \rho\mathbf{g}
\tag{1}
$$

em que $\frac{\mathrm{D}}{\mathrm{D}t}$ representa a derivada material,
$\boldsymbol{\tau}$ corresponde ao tensor de tensões viscosas, $p$ representa a
pressão, $\rho$ a densidade do fluido, $\mathbf{u}$ o campo de velocidades e
$\mathbf{g}$ as forças externas aplicadas ao sistema.

Para fluidos Newtonianos incompressíveis com viscosidade constante, o termo
viscoso pode ser simplificado conforme a **Equação 2**:

$$
\nabla\cdot\boldsymbol{\tau} = \mu\nabla^2\mathbf{u}
\tag{2}
$$

em que $\mu$ representa a viscosidade dinâmica do fluido. Além disso, a
derivada material do campo de velocidades corresponde à aceleração do fluido:

$$
\frac{\mathrm{D}\mathbf{u}}{\mathrm{D}t} = \mathbf{a}
\tag{3}
$$

Substituindo as Equações 2 e 3 na Equação 1, obtém-se:

$$
\rho\mathbf{a} = -\nabla p + \mu\nabla^2\mathbf{u} + \rho\mathbf{g}
\tag{4}
$$

Dividindo todos os termos pela densidade $\rho$ e definindo a viscosidade
cinemática como:

$$
\nu = \frac{\mu}{\rho}
\tag{5}
$$

obtém-se a forma simplificada das equações de Navier-Stokes utilizada neste
trabalho:

$$
\mathbf{a} = -\frac{\nabla p}{\rho} + \nu\nabla^2\mathbf{u} + \mathbf{g}
\tag{6}
$$

em que $\mathbf{a}$ representa a aceleração do fluido, $p$ a pressão, $\rho$ a
densidade, $\nu$ a viscosidade cinemática, $\mathbf{u}$ o campo de velocidades e
$\mathbf{g}$ as forças externas aplicadas ao sistema, como a gravidade.

Nessa formulação, o termo do gradiente de pressão acelera o fluido de regiões de
maior pressão para regiões de menor pressão. O termo viscoso representa a
dissipação interna do fluido, suavizando diferenças de velocidade entre regiões
vizinhas, enquanto o termo de forças externas adiciona acelerações provocadas
por agentes externos.

Além da conservação de momento, fluidos incompressíveis devem satisfazer a
condição de conservação de massa, apresentada na **Equação 7**:

$$
\nabla\cdot\mathbf{u} = 0
\tag{7}
$$

indicando que a divergência do campo de velocidades é nula. Isso significa que a
quantidade de fluido que entra em uma região é igual à quantidade que sai,
mantendo a densidade aproximadamente constante ao longo da simulação.

### 2.1 Aplicando à simulação

No método SPH, as equações diferenciais contínuas apresentadas anteriormente
(Equações 6 e 7) são convertidas em interações discretas entre partículas. Em
vez de resolver diretamente as derivadas em um domínio contínuo, o fluido é
mapeado por um conjunto finito de nós massivos discretos (as partículas), os
quais armazenam propriedades físicas locais, como posição, velocidade, densidade
e pressão. A dinâmica macroscópica do meio contínuo emerge, portanto, das
interações locais entre partículas vizinhas dentro de um raio de influência
delimitado pelo kernel de suavização.

Matematicamente, as grandezas físicas do fluido são aproximadas numericamente
sobre esse conjunto discreto. Propriedades contínuas são interpoladas
localmente utilizando as contribuições das partículas vizinhas, ponderadas pela
função kernel. A aproximação de uma grandeza escalar qualquer $A$ na posição
espacial $r$ é regida pela **Equação 8**:

$$
A_S(r) = \sum_j m_j \frac{A_j}{\rho_j} W(r-r_j,h)
\tag{8}
$$

em que $m_j$ representa a massa da partícula $j$, $A_j$ denota a grandeza física
associada a ela, $\rho_j$ equivale à sua densidade local, $r_j$ define sua
posição espacial e $W(r-r_j,h)$ corresponde ao kernel de suavização dotado de
raio de suporte $h$. Dessa forma, os operadores diferenciais presentes na
Equação de Navier-Stokes são convertidos em somatórios locais sobre a vizinhança,
transformando o sistema contínuo em uma formulação computacionalmente viável.

Para traduzir esse arcabouço matemático em um ambiente virtual de alto
desempenho, a implementação do simulador foi estruturada sob o paradigma
*Entity Component System* (ECS). Essa abordagem permite a separação estrita
entre os dados físicos e os algoritmos de processamento do método SPH. Sob essa
ótica, cada partícula é tratada puramente como uma entidade, cujos atributos e
estados são distribuídos em componentes especializados, enquanto sistemas
independentes encapsulam as etapas de cálculo numérico executadas a cada passo
de tempo $\Delta t$.

Na arquitetura desenvolvida, a entidade-partícula é composta por quatro
estruturas fundamentais:

- `PositionComponent`: armazena as coordenadas espaciais da partícula;
- `VelocityComponent`: mantém o vetor de velocidade linear utilizado na
  integração temporal;
- `DensityComponent`: encapsula as propriedades de estado do fluido,
  especificamente a densidade local ($\rho$) e a pressão interna ($p$);
- `CircleComponent`: retém os atributos estéticos e primitivas geométricas
  necessárias para o pipeline de renderização.

O fluxo de processamento físico e a translação desses dados são operados por
sistemas dedicados que percorrem as entidades de forma sequencial.
Inicialmente, o sistema `ComputeDensity()` calcula a densidade local a partir da
distribuição espacial dos vizinhos. Na sequência, os sistemas
`ComputePressureForce()` e `ComputeViscosityForce()` determinam,
respectivamente, as forças repulsivas de pressão e o termo viscoso associado à
dissipação interna de energia.

Dispostas as forças resultantes, o sistema `UpdatePosition()` realiza a
integração temporal para atualizar o estado cinemático do sistema. Por fim, o
pipeline é concluído com o sistema `RenderParticle()`, responsável pela
rasterização do fluido. A **Figura 3** ilustra a topologia dessa organização e o
fluxo de dependências entre os módulos.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/ecs_overview.png"
alt="Organização da simulação SPH utilizando a arquitetura ECS." width="550">
_Figura 3. Organização da simulação SPH utilizando a arquitetura ECS e fluxo de
dependências dos sistemas responsáveis pelo cálculo físico, integração temporal
e renderização das partículas._

Além de isolar as responsabilidades do código, a adoção da arquitetura ECS
oferece vantagens cruciais de desempenho para simulações de mecânica dos
fluidos. Como todas as partículas compartilham a mesma composição de
componentes, seus dados são alocados de maneira contígua na memória (em arrays
densos). Essa organização otimiza a localidade de referência (tanto espacial
quanto temporal) e maximiza o aproveitamento das linhas de *cache* do
processador, mitigando o gargalo de transferências esparsas de memória
(*cache misses*) — um fator determinante para a viabilidade de simulações
iterativas contendo milhares de partículas em tempo real.

#### 2.1.1 Smoothing Kernel

O kernel de suavização define como a influência de uma partícula diminui com a
distância. Durante a simulação, cada partícula considera apenas vizinhas
localizadas dentro do raio de suporte $h$, reduzindo o custo computacional e
garantindo interações locais.

Para garantir estabilidade e conservação das propriedades físicas do fluido, o
kernel deve ser normalizado conforme a **Equação 9**:

$$
\int W(r)\,dr = 1
\tag{9}
$$

garantindo que a soma das contribuições preserve a massa e as propriedades do
fluido.

Na prática, o valor do kernel é calculado para cada par de partículas vizinhas,
produzindo um peso proporcional à distância entre elas. Partículas mais próximas
exercem maior influência, enquanto partículas distantes possuem contribuição
reduzida ou nula.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/smoothing_radius.png"
alt="Representação visual da área de influência (smoothing radius) de uma única partícula central." width="650">
_Figura 4. Representação visual da área de influência (smoothing radius) de uma
única partícula central, indicando o decaimento radial da influência do kernel
até o raio de suporte $h$._

#### 2.1.2 Kernels especializados

A estabilidade, precisão e desempenho do método SPH dependem diretamente da
escolha das funções kernel utilizadas durante a simulação. Essas funções são
responsáveis por definir como as propriedades físicas de uma partícula
influenciam suas vizinhas dentro do raio de suporte $h$.

Segundo Müller, Charypar e Gross [[3]](#referencias), kernels adequados para SPH
devem ser normalizados, possuir simetria radial e apresentar valor e derivadas
nulas na fronteira do raio de suporte. Essas propriedades contribuem para a
estabilidade numérica da simulação e evitam descontinuidades nas forças entre
partículas.

Embora o SPH utilize uma formulação geral baseada em kernels de suavização,
diferentes operadores físicos exigem propriedades matemáticas específicas.
Dessa forma, implementações práticas normalmente utilizam kernels distintos para
densidade, pressão e viscosidade.

##### Kernel Poly6

O kernel Poly6 é utilizado principalmente para o cálculo da densidade devido ao
seu comportamento suave e estável. Sua formulação é dada por:

$$
W_{\rho}(r,h) =
\frac{315}{64\pi h^9}
\begin{cases}
(h^2-r^2)^3 & 0 \le r \le h \\
0           & \text{caso contrário,}
\end{cases}
\tag{10}
$$

Uma característica importante desse kernel é que a distância aparece apenas na
forma quadrática ($r^2$), permitindo calcular sua influência sem utilizar raízes
quadradas durante a computação das distâncias entre partículas. Isso reduz
significativamente o custo computacional da simulação.

Além disso, o Poly6 produz distribuições suaves de densidade, tornando-o
adequado para a interpolação de grandezas escalares no fluido.

```cpp
float Poly6Kernel(float r2, float h) {
  float h2 = h * h;

  if (r2 > h2)
    return 0.0f;

  float diff = h2 - r2;

  float coeff = 315.0f / (64.0f * PI * pow(h, 9));

  return coeff * pow(diff, 3);
}
```
_Código 1. Implementação do kernel Poly6 (C++)._

##### Kernel Spiky

Embora o kernel Poly6 seja eficiente para densidade, ele apresenta problemas no
cálculo das forças de pressão. Quando partículas ficam extremamente próximas, o
gradiente do Poly6 tende a zero no centro, reduzindo a força de repulsão entre
as partículas e favorecendo a formação de agrupamentos artificiais sob altas
pressões.

Para evitar esse problema, Müller, Charypar e Gross [[3]](#referencias) utilizam
o kernel Spiky no cálculo das forças de pressão:

$$
W_{s}(r,h) =
\frac{15}{\pi h^6}
\begin{cases}
(h-r)^3 & 0 \le r \le h \\
0       & \text{caso contrário,}
\end{cases}
\tag{11}
$$

O principal diferencial desse kernel é seu gradiente não nulo próximo ao centro,
produzindo forças repulsivas mais intensas entre partículas muito próximas. Isso
melhora significativamente a estabilidade do cálculo de pressão e evita
aglomerações numéricas no fluido.

Além disso, o kernel Spiky possui derivadas suaves e nulas na fronteira do raio
de suporte, reduzindo descontinuidades nas forças calculadas.

```cpp
float SpikyKernel(float r, float h) {
  if (r > h)
    return 0.0f;

  float diff = h - r;

  float coeff = 15.0f / (PI * pow(h, 6));

  return coeff * pow(diff, 3);
}
```
_Código 2. Implementação do kernel Spiky (C++)._

##### Kernel de viscosidade

A viscosidade modela o atrito interno do fluido e possui efeito dissipativo,
reduzindo diferenças de velocidade entre partículas vizinhas. Entretanto,
kernels tradicionais podem produzir Laplacianos negativos em determinadas
regiões, gerando forças viscosas instáveis que aumentam artificialmente a
velocidade relativa entre partículas.

Para evitar esse problema, Müller, Charypar e Gross [[3]](#referencias) propõem
um kernel específico para viscosidade:

$$
W_{\nu}(r,h) =
\frac{15}{2\pi h^3}
\begin{cases}
\left(
-\frac{r^3}{2h^3}
+\frac{r^2}{h^2}
+\frac{h}{2r}
-1
\right)
& 0 \le r \le h \\
0 & \text{caso contrário,}
\end{cases}
\tag{12}
$$

Esse kernel foi projetado para possuir Laplaciano positivo em todo o domínio,
garantindo que as forças viscosas atuem sempre dissipando energia e suavizando o
campo de velocidades.

Seu Laplaciano é dado por:

$$
\nabla^2 W_{\nu}(r,h) =
\frac{45}{\pi h^6}(h-r)
\tag{13}
$$

mantendo comportamento estável mesmo em simulações com baixa quantidade de
partículas.

A utilização desse kernel melhora significativamente a estabilidade numérica da
simulação, reduzindo oscilações e diminuindo a necessidade de técnicas
adicionais de amortecimento.

```cpp
float ViscosityKernel(float r, float h) {
  if (r <= 0.0f || r > h)
    return 0.0f;

  float r2 = r * r;
  float r3 = r2 * r;

  float h2 = h * h;
  float h3 = h2 * h;

  float coeff = 15.0f / (2.0f * PI * h3);

  float value =
    -(r3 / (2.0f * h3)) +
    (r2 / h2) +
    (h / (2.0f * r)) - 1.0f;

  return coeff * value;
}
```
_Código 3. Implementação do kernel de viscosidade (C++)._

A **Figura 5** compara os três kernels utilizados, juntamente com seus
gradientes e Laplacianos.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/kernel_funcs.png"
alt="Os kernels Wρ, Ws e Wν, com h = 1." width="650">
*Figura 5. Os kernels $W_{\rho}$, $W_{s}$ e $W_{\nu}$, com $h = 1$. As linhas
espessas representam os kernels, as finas seus gradientes e as tracejadas o
Laplaciano, escalado em 0,1×.*

#### 2.1.3 Cálculo da densidade

Após determinar as partículas vizinhas, a densidade local de cada partícula é
calculada por meio da soma ponderada das massas vizinhas utilizando o kernel de
suavização. Essa etapa corresponde à discretização da conservação de massa.

Cada partícula representa um pequeno volume do fluido definido por:

$$
V_i = \frac{m_i}{\rho_i}
\tag{14}
$$

em que a massa permanece constante ao longo da simulação, enquanto a densidade
varia dinamicamente conforme a distribuição espacial das partículas.

A densidade local é então estimada pela **Equação 15**:

$$
\rho_S(r) =
\sum_j
m_j
W_{\rho}(r-r_j,h)
\tag{15}
$$

Esse cálculo está diretamente relacionado à condição de incompressibilidade da
Equação 7, pois grandes variações de densidade indicam desvios do comportamento
incompressível esperado.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/density_visual.png"
alt="Representação da visual de densidade local, ρS = 11." width="650">
_Figura 6. Representação da visual de densidade local, $\rho_S = 11$, a partir
das contribuições ponderadas das partículas vizinhas contidas no raio $h$._

A implementação da Equação 15 é apresentada no **Código 4**. Para cada partícula
$i$, o algoritmo percorre suas partículas vizinhas localizadas dentro do raio de
suporte $h$, acumulando suas contribuições por meio da função kernel
`Poly6Kernel`. A densidade local é então obtida pela soma ponderada entre a
massa $m_j$ das partículas vizinhas e o valor do kernel em função da distância
relativa entre as partículas.

```cpp
void ComputeDensity() {
  float h = entities::smoothing_radius;
  float h2 = h * h;
  float m = entities::particle_size;
  size_t N = particle_entities.size();

  for (size_t i = 0; i < N; ++i) {
    Vector2 r = particles[i].position;

    float rho = 0.0f;

    for (size_t j : GetNeighborParticles(i)) {
      Vector2 r_j = particles[j].position;

      float rx = r_j.x - r.x;
      float ry = r_j.y - r.y;

      float r2 = rx * rx + ry * ry;

      if (r2 <= h2)
        rho += m * Poly6Kernel(r2, h);
    }

    particles[i].density = rho;
  }
}
```
_Código 4. Cálculo da densidade SPH (C++)._

#### 2.1.4 Cálculo da pressão

Após o cálculo da densidade, a pressão de cada partícula pode ser obtida por uma
equação de estado, relacionando a densidade local $\rho$ com a densidade de
repouso do fluido. Em métodos SPH fracamente compressíveis, pequenas variações
de densidade são utilizadas para gerar forças restauradoras que mantêm o fluido
aproximadamente incompressível ao longo da simulação.

Na formulação das equações de Navier-Stokes apresentada na Equação 6, o termo
responsável pelas forças de pressão é:

$$
-\frac{\nabla p}{\rho}
\tag{16}
$$

o qual acelera o fluido das regiões de maior pressão para as regiões de menor
pressão. No contexto do SPH, esse termo é discretizado utilizando o gradiente da
função kernel.

A aproximação SPH do gradiente de uma grandeza escalar $A$ é dada por:

$$
\nabla A_S(r) =
\sum_j
m_j \frac{A_j}{\rho_j}
\nabla W(r-r_j,h)
\tag{17}
$$

em que $m_j$ representa a massa da partícula vizinha, $\rho_j$ sua densidade e
$\nabla W$ o gradiente do kernel de suavização.

Aplicando essa formulação ao termo de pressão, obtém-se uma aproximação das
forças de pressão entre partículas vizinhas. Essas forças produzem acelerações
repulsivas em regiões comprimidas do fluido, afastando partículas muito próximas
e contribuindo para a manutenção da estabilidade numérica da simulação.

Para esse cálculo, é utilizado o kernel Spiky, apresentado anteriormente na
Equação 11. Diferentemente do kernel Poly6, o Spiky possui gradiente não nulo
próximo ao centro, produzindo forças repulsivas mais intensas entre partículas
muito próximas e evitando aglomerações artificiais no fluido.

A **Figura 7** ilustra o efeito das forças de pressão entre partículas,
responsáveis por acelerar o fluido em direção às regiões de menor pressão.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/pressure_force.png"
alt="Representação das forças de pressão entre partículas vizinhas." width="650">
_Figura 7. Representação das forças de pressão entre partículas vizinhas,
produzindo aceleração em direção às regiões de menor pressão. Na simulação, as
áreas brancas representam a pressão alvo do fluido, enquanto regiões em vermelho
indicam alta pressão e regiões em azul representam baixa pressão._

A implementação do cálculo das forças de pressão é apresentada no **Código 5**.
Para cada partícula $i$, o algoritmo percorre suas partículas vizinhas
localizadas dentro do raio de suporte $h$, acumulando suas contribuições por
meio do gradiente da função kernel `SpikyKernelGradient`. A força de pressão é
então obtida a partir da pressão $p_i$ e da densidade $\rho_j$ das partículas
vizinhas, produzindo forças repulsivas proporcionais à compressão local do
fluido e orientadas na direção entre as partículas.

```cpp
void ComputePressureForce() {
  float h = entities::smoothing_radius;
  float m = entities::particle_size;
  size_t N = particle_entities.size();

  for (size_t i = 0; i < N; ++i) {
    Vector2 r = particles[i].position;
    float rho_i = particles[i].density;
    float p_i = particles[i].pressure;

    Vector2 pressure_force = {0.0f, 0.0f};
    for (size_t j : GetNeighborParticles(i)) {
      if (i == j) continue;

      Vector2 r_j = particles[j].position;
      float rho_j = particles[j].density;
      float p_j = particles[j].pressure;

      float rx = r_j.x - r.x;
      float ry = r_j.y - r.y;

      float dist = sqrt(rx * rx + ry * ry);
      if (dist > 0.0f && dist <= h) {
        Vector2 grad =
          SpikyKernelGradient(rx, ry, dist, h);

        float pressure =
          -m * (p_i + p_j) / (2.0f * rho_j);

        pressure_force.x += pressure * grad.x;
        pressure_force.y += pressure * grad.y;
      }
    }

    particles[i].pressure_force = pressure_force;
  }
}
```
_Código 5. Cálculo das forças de pressão SPH (C++)._

#### 2.1.5 Cálculo da viscosidade

A viscosidade é responsável pela dissipação de energia e pelo amortecimento das
diferenças de velocidade entre partículas vizinhas. Esse efeito modela o atrito
interno do fluido e contribui para a estabilidade da simulação.

No SPH, o termo viscoso é obtido utilizando o Laplaciano do kernel de suavização.
O operador Laplaciano é aproximado pela **Equação 18**:

$$
\nabla^2 A_S(r) =
\sum_j
m_j \frac{A_j}{\rho_j}
\nabla^2 W(r-r_j,h)
\tag{18}
$$

Essa aproximação permite discretizar diretamente o termo viscoso das Equações de
Navier-Stokes:

$$
\nu \nabla^2 \mathbf{u}
\tag{19}
$$

em que $\nu$ representa a viscosidade cinemática do fluido.

Na prática, esse termo suaviza diferenças bruscas de velocidade entre
partículas próximas, reduzindo oscilações numéricas e produzindo um movimento
mais contínuo e estável.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/viscosity_effect.png"
alt="Representação do efeito viscoso no método SPH." width="650">
_Figura 8. Representação do efeito viscoso no método SPH. A viscosidade suaviza
diferenças locais de velocidade entre partículas vizinhas, produzindo um
escoamento mais contínuo e estável._

A implementação do termo viscoso é apresentada no **Código 6**. Para cada
partícula $i$, o algoritmo percorre suas partículas vizinhas localizadas dentro
do raio de suporte $h$, calculando a diferença de velocidade entre as partículas
e aplicando o Laplaciano do kernel de viscosidade por meio da função
`ViscosityKernelLaplacian`. A contribuição viscosa é obtida a partir da
viscosidade cinemática $\nu$, da massa $m$, da densidade da partícula vizinha
$\rho_j$ e da diferença relativa de velocidades. Essas contribuições são
acumuladas no vetor `viscosity_force`, produzindo uma força que suaviza
diferenças bruscas de velocidade entre partículas próximas, aproximando
numericamente o termo viscoso $(\nu \nabla^2 \mathbf{u})$ das equações de
Navier-Stokes.

```cpp
void ComputeViscosityForce() {
  float h = entities::smoothing_radius;
  float m = entities::particle_size;
  float nu = entities::viscosity;
  size_t N = particle_entities.size();

  for (size_t i = 0; i < N; ++i) {
    Vector2 v_i = particles[i].velocity;
    float rho_i = particles[i].density;

    Vector2 viscosity_force = {0.0f, 0.0f};
    for (size_t j : GetNeighborParticles(i)) {
      if (i == j) continue;

      Vector2 v_j = particles[j].velocity;
      float rho_j = particles[j].density;
      Vector2 r =
        particles[j].position
        - particles[i].position;

      float dist = sqrt(r.x * r.x + r.y * r.y);
      if (dist > 0.0f && dist <= h) {
        float laplacian =
          ViscosityKernelLaplacian(dist, h);

        Vector2 velocity_diff = {
          v_j.x - v_i.x,
          v_j.y - v_i.y
        };

        float viscosity =
          (nu * m * laplacian) / rho_j;

        viscosity_force.x +=
          viscosity * velocity_diff.x;
        viscosity_force.y +=
          viscosity * velocity_diff.y;
      }
    }

    particles[i].viscosity_force = viscosity_force;
  }
}
```
_Código 6. Cálculo das forças viscosas no método SPH (C++)._

Após o cálculo das forças de pressão, viscosidade e forças externas como a
gravidade $\mathbf{g}$, a aceleração total de cada partícula é atualizada. Com
isso, velocidade e posição podem ser integradas numericamente ao longo do tempo,
permitindo a evolução dinâmica do fluido.

Dessa forma, as equações contínuas de Navier-Stokes passam a ser representadas
por interações locais entre partículas vizinhas, permitindo simular o
comportamento macroscópico do fluido a partir de operações discretas e
computacionalmente viáveis.

---

## 3. Resultados

Esta seção apresenta os resultados obtidos com a implementação do método
*Smoothed Particle Hydrodynamics* (SPH) utilizando a arquitetura *Entity
Component System* (ECS). Inicialmente, são apresentadas as configurações de
hardware, software e os parâmetros utilizados nos experimentos. Em seguida, é
analisado o desempenho da implementação em função da quantidade de partículas,
considerando a taxa de quadros por segundo e o tempo de processamento de cada
passo da simulação.

### 3.1 Configuração da simulação

Os experimentos foram realizados utilizando uma simulação bidimensional baseada
em partículas SPH. Cada partícula representa uma pequena porção do fluido e
armazena propriedades físicas locais utilizadas durante os cálculos de
densidade, pressão e viscosidade.

A implementação foi desenvolvida e executada em um notebook Acer Predator
Helios Neo 16S AI. A **Tabela 1** apresenta a configuração de hardware e
software utilizada durante os experimentos.

_Tabela 1. Configuração do ambiente utilizado nos experimentos._

| Componente | Especificação |
| --- | --- |
| Sistema operacional | CachyOS Linux x86_64 |
| Kernel | Linux 7.0.10 |
| Processador | Intel Core Ultra 9 275HX |
| Quantidade de núcleos | 24 núcleos, 24 threads |
| Frequência máxima | 5.40 GHz |
| GPU dedicada | NVIDIA GeForce RTX 5070 Ti Mobile |
| GPU integrada | Intel Graphics |
| Memória RAM | 32 GB DDR5 6400MHz |

Os experimentos foram realizados variando a quantidade de partículas entre 50 e
10,000. Os demais parâmetros foram mantidos constantes durante as execuções. A
**Tabela 2** apresenta os valores utilizados.

_Tabela 2. Parâmetros utilizados na simulação SPH._

| Parâmetro | Valor |
| --- | ---: |
| Quantidade de partículas | 50–10000 |
| Tamanho de partícula | 2.0 |
| Raio de suporte ($h$) | 50.0 |
| Passo temporal ($\Delta t$) | 0.2 |
| Passos simulados ($N_s$) | 250 |
| Densidade alvo ($\rho$) | 0.000425 |
| Viscosidade ($\nu$) | 0.8 |
| Multiplicador de Pressão ($-\nabla p/\rho$) | 250.0 |
| Gravidade ($g$) | 1.0 |
| Resolução da simulação | 1920 × 1080 |

### 3.2 Resultados visuais

As **Figuras 9 e 10** apresentam diferentes momentos da execução da simulação
SPH. As imagens permitem visualizar o comportamento das partículas durante a
execução do programa, evidenciando a formação e o deslocamento do fluido no
ambiente de simulação.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/simulation_01.png"
alt="Primeiro momento da execução da simulação SPH." width="850">
_Figura 9. Primeiro momento da simulação._

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/simulation_02.png"
alt="Segundo momento da execução da simulação SPH." width="850">
_Figura 10. Segundo momento da simulação._

### 3.3 Desempenho computacional

O desempenho foi avaliado em duas configurações. A primeira corresponde à
execução *headless*, na qual a simulação é executada sem a etapa de renderização
gráfica. A segunda corresponde à execução completa, incluindo a renderização das
partículas na resolução de 1920 × 1080.

Essa distinção permite avaliar separadamente o custo associado ao processamento
da simulação e o custo adicional introduzido pela renderização. Nos gráficos
apresentados a seguir, a série representada em amarelo corresponde à execução
*headless*, enquanto a série representada em vermelho corresponde à execução com
renderização.

#### 3.3.1 Taxa de quadros

A **Figura 11** apresenta a taxa de quadros por segundo (FPS) em função da
quantidade de partículas para as duas configurações de execução.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/results_fps.png"
alt="Taxa de quadros por segundo em função da quantidade de partículas." width="650">
_Figura 11. Taxa de quadros por segundo em função da quantidade de partículas. A
série amarela corresponde à execução *headless* e a série vermelha à execução
com renderização._

Em ambas as configurações, observa-se uma redução da taxa de quadros à medida
que a quantidade de partículas aumenta. Esse comportamento decorre do aumento do
número de operações necessárias para calcular as propriedades e interações entre
as partículas.

A execução *headless* apresenta desempenho superior à execução com renderização
em toda a faixa avaliada. Para 10,000 partículas, por exemplo, a execução
*headless* atingiu aproximadamente 32,2 FPS, enquanto a execução com
renderização atingiu aproximadamente 23,9 FPS. Portanto, nessa configuração, a
renderização introduziu um custo adicional perceptível sobre o desempenho total
da aplicação.

#### 3.3.2 Tempo de processamento

A **Figura 12** apresenta o tempo médio necessário para processar cada passo da
simulação em função da quantidade de partículas.

<img src="/blog/posts/simulacao-de-fluidos-sph-usando-ecs/results_time.png"
alt="Tempo de processamento por passo em função da quantidade de partículas." width="650">
_Figura 12. Tempo de processamento por passo em função da quantidade de
partículas. A série amarela corresponde à execução *headless* e a série vermelha
à execução com renderização._

Os resultados apresentam o comportamento inverso ao observado no gráfico de FPS:
o tempo necessário para executar cada passo aumenta com a quantidade de
partículas. Para 10,000 partículas, o tempo médio por passo foi de
aproximadamente 31,0 ms na execução *headless* e 41,8 ms na execução com
renderização.

A diferença entre as duas configurações evidencia o impacto da renderização
sobre o tempo total de execução. Enquanto a versão *headless* permite avaliar
predominantemente o custo computacional da simulação SPH, a versão com
renderização inclui também o processamento necessário para apresentar os
resultados graficamente.

Considerando os dois indicadores em conjunto, observa-se que o aumento da
quantidade de partículas reduz progressivamente o desempenho da aplicação.
Ainda assim, a versão com renderização mantém aproximadamente 24 FPS com 10,000
partículas, enquanto a versão *headless* permanece acima de 30 FPS nessa
configuração.

---

## 4. Discussão

Os resultados obtidos demonstram que a implementação desenvolvida é capaz de
reproduzir o comportamento dinâmico de um fluido utilizando o método *Smoothed
Particle Hydrodynamics* (SPH) integrado à arquitetura *Entity Component System*
(ECS). A representação baseada em partículas, aliada aos kernels especializados
para densidade, pressão e viscosidade, segue a abordagem tradicional do SPH para
a discretização das equações da mecânica dos fluidos [[3, 9]](#referencias). Os
resultados visuais obtidos indicam que essa formulação foi capaz de produzir um
comportamento coerente e suficientemente estável para os parâmetros utilizados
nos experimentos.

Do ponto de vista computacional, os resultados confirmam que o aumento da
quantidade de partículas possui impacto direto sobre o custo da simulação. Esse
comportamento é característico de métodos SPH, nos quais as propriedades físicas
são calculadas a partir das interações entre partículas dentro de uma vizinhança
local [[9, 10]](#referencias). Assim, o aumento da quantidade de partículas eleva
o número de operações realizadas a cada passo temporal, resultando em maior
tempo de processamento e, consequentemente, menor taxa de quadros.

A utilização do ECS contribui principalmente para a organização estrutural da
implementação. A separação entre entidades, componentes e sistemas permite
manter os dados das partículas desacoplados dos procedimentos responsáveis pelo
seu processamento, seguindo o princípio de separação entre dados e lógica
característico de arquiteturas orientadas a dados [[4]](#referencias). Essa
característica facilita a manutenção e a extensão do simulador, permitindo, por
exemplo, modificar os cálculos físicos sem alterar diretamente a estrutura que
representa as partículas. Além disso, a organização dos dados em componentes
especializados fornece uma estrutura adequada para percursos sistemáticos sobre
as partículas e para futuras estratégias de paralelização.

Entretanto, os resultados também mostram que a utilização do ECS, por si só, não
elimina os custos computacionais associados ao método SPH. A arquitetura define
principalmente a forma como os dados e os sistemas são organizados, enquanto o
custo dos cálculos físicos permanece relacionado à quantidade de partículas e às
interações necessárias entre suas vizinhanças [[4, 9]](#referencias). Dessa
forma, embora o ECS forneça uma organização adequada para os dados e sistemas do
simulador, o aumento do desempenho depende também da eficiência das operações
realizadas sobre as vizinhanças e da capacidade de processá-las de forma
concorrente.

A busca de vizinhos utilizada na implementação é baseada em *spatial hashing*,
permitindo restringir a procura às regiões do espaço que podem conter partículas
dentro do raio de suporte $h$. Essa estratégia é particularmente importante em
métodos SPH, nos quais os cálculos são baseados nas contribuições das partículas
pertencentes à vizinhança local definida pelo suporte do kernel
[[9, 10]](#referencias). Dessa forma, o *spatial hashing* evita a comparação
direta de cada partícula com todo o conjunto de partículas, reduzindo o número
de verificações necessárias durante os cálculos de densidade, pressão e
viscosidade.

Apesar dessa otimização, o custo computacional das interações entre partículas
continua relevante à medida que a quantidade de partículas aumenta. Os resultados
evidenciam esse comportamento pela redução progressiva do FPS e pelo aumento do
tempo de processamento por passo. Assim, o *spatial hashing* reduz o custo da
etapa de identificação das vizinhanças, mas não elimina o processamento
necessário para avaliar as interações entre as partículas efetivamente
encontradas. Esse aspecto é inerente à formulação particulada do SPH, na qual as
propriedades físicas são obtidas por somatórios sobre as partículas vizinhas
[[9]](#referencias).

Outro fator que deve ser considerado na interpretação dos resultados é a
implementação de *multi-thread* utilizada durante os experimentos. Foram
observados problemas de acesso concorrente aos dados das partículas, que
resultaram em comportamento anômalo em algumas execuções. Os picos observados
nos gráficos de FPS e de tempo por passo devem, portanto, ser interpretados com
cautela, pois podem estar relacionados às condições de concorrência da
implementação, e não exclusivamente ao comportamento do algoritmo SPH. Essa
limitação reduz a confiabilidade de parte das medições e impede que os resultados
sejam considerados uma caracterização definitiva da escalabilidade do sistema.

A correção do processamento concorrente constitui, portanto, uma etapa importante
para uma avaliação mais precisa do desempenho. Uma implementação adequada de
paralelismo poderia distribuir entre diferentes *threads* as operações
independentes realizadas sobre as partículas, garantindo que os acessos aos
dados compartilhados não produzam condições de corrida. Nesse contexto, a
separação entre dados e processamento proporcionada pelo ECS pode facilitar a
identificação das etapas que podem ser executadas em paralelo
[[4]](#referencias).

Como possibilidade de trabalhos futuros, o processamento do *spatial hash* e das
interações entre partículas pode ser otimizado por meio de paralelização adequada
e processamento em GPU. Técnicas de aceleração e estratégias mais avançadas de
processamento de vizinhança constituem abordagens relevantes para aumentar a
escalabilidade de métodos SPH [[10]](#referencias). Essas abordagens podem
reduzir o custo das etapas mais intensivas da simulação e permitir a
investigação de configurações com maior quantidade de partículas.

---

## 5. Conclusão

Este trabalho apresentou o desenvolvimento de uma simulação de fluidos baseada no
método *Smoothed Particle Hydrodynamics* (SPH), utilizando a arquitetura
*Entity Component System* (ECS) para organizar os dados e o processamento das
partículas. A implementação foi construída a partir da discretização das
equações de Navier-Stokes, incorporando os efeitos de pressão, viscosidade e
forças externas, conforme a formulação utilizada em métodos SPH
[[3, 9]](#referencias), com kernels especializados para o cálculo das diferentes
propriedades físicas.

Os resultados demonstraram que a abordagem adotada é capaz de produzir uma
simulação visualmente coerente e executar milhares de partículas em tempo
interativo. Também foi observado que o aumento da quantidade de partículas eleva
o tempo necessário para processar cada passo e reduz a taxa de quadros,
evidenciando o impacto das interações entre partículas sobre a escalabilidade do
método. A comparação entre as execuções *headless* e com renderização mostrou
ainda que a etapa gráfica representa um custo adicional relevante para o
desempenho da aplicação.

A utilização do ECS mostrou-se adequada para estruturar o simulador, separando
os dados das partículas dos sistemas responsáveis pelo processamento físico e
pela renderização. Essa organização está de acordo com o princípio de separação
entre dados e lógica associado a arquiteturas orientadas a dados, conforme
discutido por Bilas [[4]](#referencias). Dessa forma, o ECS estabelece uma base
estrutural adequada para a modularidade do simulador e para futuras estratégias
de paralelização e otimização.

Apesar dos resultados obtidos, a implementação ainda apresenta limitações,
principalmente relacionadas ao processamento concorrente e ao custo das
interações entre partículas. Os problemas identificados na implementação de
*multi-thread* também comprometem parte das medições de desempenho, tornando
necessária sua correção antes de uma avaliação definitiva da escalabilidade do
sistema.

Como continuidade deste trabalho, a implementação pode ser aprimorada por meio
da otimização do processamento das vizinhanças, do paralelismo adequado entre os
sistemas ECS e de técnicas de computação em GPU. Estratégias de aceleração do
processamento de vizinhos e de paralelização são particularmente relevantes para
métodos SPH devido ao grande número de operações envolvidas nas interações entre
partículas [[10]](#referencias). Essas melhorias podem permitir o processamento
de uma quantidade maior de partículas, aumentar a taxa de quadros e ampliar a
aplicabilidade da implementação em simulações interativas de maior escala.

---

## Referências

1. LUCY, L. B. *A Numerical Approach to the Testing of the Fission Hypothesis*.
   The Astronomical Journal, v. 82, n. 12, p. 1013–1024, 1977. Disponível em:
   <https://articles.adsabs.harvard.edu/pdf/1977AJ.....82.1013L> (acesso em
   18/09/2026).
2. GINGOLD, R. A.; MONAGHAN, J. J. *Smoothed Particle Hydrodynamics: Theory and
   Application to Non-Spherical Stars*. Monthly Notices of the Royal
   Astronomical Society, v. 181, p. 375–389, 1977. Disponível em:
   <https://academic.oup.com/mnras/article/181/3/375/988212> (acesso em
   18/09/2026).
3. MÜLLER, Matthias; CHARYPAR, David; GROSS, Markus. *Particle-Based Fluid
   Simulation for Interactive Applications*. In: Proceedings of the 2003 ACM
   SIGGRAPH/Eurographics Symposium on Computer Animation. p. 154–159, 2003.
   DOI: 10.2312/SCA03/154-159. Disponível em:
   <https://matthias-research.github.io/pages/publications/sca03.pdf> (acesso
   em 18/09/2026).
4. BILAS, Scott. *A Data-Driven Game Object System*. In: Game Developers
   Conference (GDC), 2002. Disponível em:
   <https://www.gamedevs.org/uploads/data-driven-game-object-system.pdf>
   (acesso em 18/09/2026).
5. KLINE, Morris. *Mathematical Thought from Ancient to Modern Times*. Oxford:
   Oxford University Press, 1972.
6. BATCHELOR, G. K. *An Introduction to Fluid Dynamics*. Cambridge: Cambridge
   University Press, 1967.
7. LANDAU, L. D.; LIFSHITZ, E. M. *Fluid Mechanics*. Oxford: Pergamon Press,
   1987.
8. FERZIGER, Joel H.; PERIĆ, Milovan. *Computational Methods for Fluid
   Dynamics*. 3. ed. Berlin: Springer, 2002. DOI: 10.1007/978-3-642-56026-2.
9. MONAGHAN, J. J. *Smoothed Particle Hydrodynamics*. Reports on Progress in
   Physics, v. 68, n. 8, p. 1703–1759, 2005. DOI:
   10.1088/0034-4885/68/8/R01.
10. KOSCHIER, Dan; BENDER, Jan; SOLENTHALER, Barbara; TESCHNER, Matthias.
    *Smoothed Particle Hydrodynamics Techniques for the Physics Based Simulation
    of Fluids and Solids*. arXiv:2009.06944, 2020. Disponível em:
    <https://arxiv.org/pdf/2009.06944> (acesso em 18/09/2026).

<br>

\- _gabrielzschmitz_
