{ pkgs ? import <nixpkgs> { } }:

rec {
  cardano-metadata-oracle =
    let
      packageJSON = builtins.fromJSON (builtins.readFile ./package.json);
      project = pkgs.callPackage ./yarn-project.nix { nodejs = pkgs.nodejs-14_x; } { src = pkgs.lib.cleanSource ./.; };
    in
    project.overrideAttrs (oldAttrs: rec {
      name = "cardano-metadata-oracle";
      version = packageJSON.version;
      buildPhase = ''
        cp -r . $out
        ln -s $out/bin/run $out/bin/${name}
      '';
    });
}
